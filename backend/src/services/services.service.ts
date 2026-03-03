import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { ReorderServicesDto } from './dto/reorder-services.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

const SERVICE_SELECT = {
  id: true,
  outletId: true,
  name: true,
  price: true,
  unit: true,
  estimatedHours: true,
  sortOrder: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(outletId: string, dto: CreateServiceDto) {
    // Cek nama duplikat dalam outlet yang sama
    const existing = await this.prisma.service.findFirst({
      where: { outletId, name: dto.name },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException(`Layanan "${dto.name}" sudah ada di outlet ini`);
    }

    // Auto sortOrder: append ke posisi paling akhir
    let sortOrder = dto.sortOrder;
    if (sortOrder === undefined) {
      const last = await this.prisma.service.findFirst({
        where: { outletId },
        orderBy: { sortOrder: 'desc' },
        select: { sortOrder: true },
      });
      sortOrder = (last?.sortOrder ?? -1) + 1;
    }

    return this.prisma.service.create({
      data: {
        outletId,
        name: dto.name,
        price: dto.price,
        unit: dto.unit ?? 'kg',
        estimatedHours: dto.estimatedHours ?? 24,
        sortOrder,
      },
      select: SERVICE_SELECT,
    });
  }

  async findAll(outletId: string, activeOnly = false) {
    return this.prisma.service.findMany({
      where: {
        outletId,
        ...(activeOnly && { isActive: true }),
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      select: SERVICE_SELECT,
    });
  }

  async findOne(outletId: string, serviceId: string) {
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, outletId },
      select: SERVICE_SELECT,
    });
    if (!service) {
      throw new NotFoundException('Layanan tidak ditemukan');
    }
    return service;
  }

  async update(outletId: string, serviceId: string, dto: UpdateServiceDto) {
    await this.findOne(outletId, serviceId);

    // Cek nama duplikat jika nama diubah
    if (dto.name !== undefined) {
      const duplicate = await this.prisma.service.findFirst({
        where: {
          outletId,
          name: dto.name,
          id: { not: serviceId },
        },
        select: { id: true },
      });
      if (duplicate) {
        throw new ConflictException(`Layanan "${dto.name}" sudah ada di outlet ini`);
      }
    }

    return this.prisma.service.update({
      where: { id: serviceId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.unit !== undefined && { unit: dto.unit }),
        ...(dto.estimatedHours !== undefined && { estimatedHours: dto.estimatedHours }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
      select: SERVICE_SELECT,
    });
  }

  async reorder(outletId: string, dto: ReorderServicesDto) {
    const ids = dto.items.map((i) => i.id);

    // Verifikasi semua ID milik outlet ini
    const found = await this.prisma.service.findMany({
      where: { id: { in: ids }, outletId },
      select: { id: true },
    });

    if (found.length !== ids.length) {
      throw new NotFoundException(
        'Satu atau lebih layanan tidak ditemukan di outlet ini',
      );
    }

    // Batch update sortOrder dalam satu transaksi
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.service.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );

    return this.findAll(outletId);
  }

  async remove(outletId: string, serviceId: string) {
    await this.findOne(outletId, serviceId);

    await this.prisma.service.update({
      where: { id: serviceId },
      data: { isActive: false },
    });

    return { message: 'Layanan berhasil dihapus' };
  }
}
