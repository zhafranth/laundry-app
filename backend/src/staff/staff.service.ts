import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { ResetPinDto } from './dto/reset-pin.dto';
import { ToggleStatusDto } from './dto/toggle-status.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

const STAFF_SELECT = {
  id: true,
  outletId: true,
  name: true,
  phone: true,
  username: true,
  role: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  async create(outletId: string, dto: CreateStaffDto) {
    const existing = await this.prisma.staff.findUnique({
      where: { outletId_username: { outletId, username: dto.username } },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('Username sudah digunakan di outlet ini');
    }

    const pinHash = await bcrypt.hash(dto.pin, 12);

    return this.prisma.staff.create({
      data: {
        outletId,
        name: dto.name,
        phone: dto.phone ?? null,
        username: dto.username,
        pinHash,
        role: dto.role ?? 'kasir',
      },
      select: STAFF_SELECT,
    });
  }

  async findAll(outletId: string) {
    return this.prisma.staff.findMany({
      where: { outletId },
      select: STAFF_SELECT,
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(outletId: string, staffId: string) {
    const staff = await this.prisma.staff.findFirst({
      where: { id: staffId, outletId },
      select: STAFF_SELECT,
    });
    if (!staff) {
      throw new NotFoundException('Staff tidak ditemukan');
    }
    return staff;
  }

  async update(outletId: string, staffId: string, dto: UpdateStaffDto) {
    await this.findOne(outletId, staffId);

    return this.prisma.staff.update({
      where: { id: staffId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.role !== undefined && { role: dto.role }),
      },
      select: STAFF_SELECT,
    });
  }

  async resetPin(outletId: string, staffId: string, dto: ResetPinDto) {
    await this.findOne(outletId, staffId);

    const pinHash = await bcrypt.hash(dto.newPin, 12);

    await this.prisma.$transaction(async (tx) => {
      // Cabut semua sesi aktif staff agar harus login ulang dengan PIN baru
      await tx.session.updateMany({
        where: { userType: UserType.staff, userRefId: staffId, isActive: true },
        data: { isActive: false },
      });
      await tx.staff.update({
        where: { id: staffId },
        data: { pinHash },
      });
    });

    return { message: 'PIN berhasil direset' };
  }

  async toggleStatus(outletId: string, staffId: string, dto: ToggleStatusDto) {
    await this.findOne(outletId, staffId);

    if (!dto.isActive) {
      // Cabut semua sesi aktif saat staff dinonaktifkan
      await this.prisma.session.updateMany({
        where: { userType: UserType.staff, userRefId: staffId, isActive: true },
        data: { isActive: false },
      });
    }

    return this.prisma.staff.update({
      where: { id: staffId },
      data: { isActive: dto.isActive },
      select: STAFF_SELECT,
    });
  }

  async remove(outletId: string, staffId: string) {
    await this.findOne(outletId, staffId);

    await this.prisma.$transaction(async (tx) => {
      // Cabut sesi aktif sebelum hapus
      await tx.session.updateMany({
        where: { userType: UserType.staff, userRefId: staffId, isActive: true },
        data: { isActive: false },
      });
      // Hard delete — attendance akan cascade delete otomatis
      await tx.staff.delete({ where: { id: staffId } });
    });

    return null;
  }
}
