import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ClockInDto } from './dto/clock-in.dto';
import { ClockOutDto } from './dto/clock-out.dto';
import { QueryAttendanceDto } from './dto/query-attendance.dto';

const ATTENDANCE_SELECT = {
  id: true,
  outletId: true,
  staffId: true,
  clockIn: true,
  clockOut: true,
  durationMin: true,
  notes: true,
  createdAt: true,
  staff: {
    select: { id: true, name: true, username: true, role: true },
  },
} as const;

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Clock-in: buat record attendance baru.
   * Validasi: staff harus aktif, tidak boleh ada clock-in yang belum clock-out.
   */
  async clockIn(outletId: string, staffId: string, dto: ClockInDto) {
    // Pastikan staff aktif dan milik outlet ini
    const staff = await this.prisma.staff.findFirst({
      where: { id: staffId, outletId, isActive: true },
      select: { id: true },
    });
    if (!staff) {
      throw new NotFoundException('Staff tidak ditemukan atau tidak aktif');
    }

    // Cek apakah ada sesi yang belum clock-out
    const openSession = await this.prisma.attendance.findFirst({
      where: { staffId, outletId, clockOut: null },
      select: { id: true },
    });
    if (openSession) {
      throw new BadRequestException(
        'Staff masih memiliki sesi aktif. Silakan clock-out terlebih dahulu.',
      );
    }

    return this.prisma.attendance.create({
      data: {
        outletId,
        staffId,
        clockIn: new Date(),
        notes: dto.notes ?? null,
      },
      select: ATTENDANCE_SELECT,
    });
  }

  /**
   * Clock-out: tutup sesi attendance yang sedang berjalan.
   * Hitung durasi otomatis (dalam menit).
   */
  async clockOut(outletId: string, staffId: string, dto: ClockOutDto) {
    // Cari sesi yang belum clock-out
    const openSession = await this.prisma.attendance.findFirst({
      where: { staffId, outletId, clockOut: null },
      select: { id: true, clockIn: true, notes: true },
    });
    if (!openSession) {
      throw new BadRequestException(
        'Tidak ada sesi aktif. Silakan clock-in terlebih dahulu.',
      );
    }

    const clockOut = new Date();
    const durationMin = Math.round(
      (clockOut.getTime() - openSession.clockIn.getTime()) / 60_000,
    );

    // Gabungkan notes clock-in + clock-out jika ada
    const notes = [openSession.notes, dto.notes].filter(Boolean).join(' | ') || null;

    return this.prisma.attendance.update({
      where: { id: openSession.id },
      data: { clockOut, durationMin, notes },
      select: ATTENDANCE_SELECT,
    });
  }

  /**
   * List attendance records dengan filter tanggal, staffId, dan pagination.
   */
  async findAll(outletId: string, query: QueryAttendanceDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Prisma.AttendanceWhereInput = { outletId };

    if (query.staffId) {
      where.staffId = query.staffId;
    }

    if (query.date) {
      const start = new Date(`${query.date}T00:00:00.000Z`);
      const end = new Date(`${query.date}T23:59:59.999Z`);
      where.clockIn = { gte: start, lte: end };
    }

    const [data, total] = await Promise.all([
      this.prisma.attendance.findMany({
        where,
        select: ATTENDANCE_SELECT,
        orderBy: { clockIn: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.attendance.count({ where }),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
