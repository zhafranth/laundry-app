import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';

const OUTLET_SELECT = {
  id: true,
  name: true,
  address: true,
  phone: true,
  logoUrl: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class OutletsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateOutletDto) {
    return this.prisma.outlet.create({
      data: {
        userId,
        name: dto.name,
        address: dto.address ?? null,
        phone: dto.phone ?? null,
      },
      select: OUTLET_SELECT,
    });
  }

  async findAll(userId: string) {
    return this.prisma.outlet.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'asc' },
      select: OUTLET_SELECT,
    });
  }

  async findOne(id: string) {
    const outlet = await this.prisma.outlet.findUnique({
      where: { id },
      select: OUTLET_SELECT,
    });

    if (!outlet || !outlet.isActive) {
      throw new NotFoundException('Outlet tidak ditemukan');
    }

    return outlet;
  }

  async update(id: string, dto: UpdateOutletDto) {
    return this.prisma.outlet.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
      },
      select: OUTLET_SELECT,
    });
  }

  async updateLogo(id: string, logoUrl: string) {
    return this.prisma.outlet.update({
      where: { id },
      data: { logoUrl },
      select: { id: true, logoUrl: true },
    });
  }
}
