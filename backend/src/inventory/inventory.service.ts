import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { RestockItemDto } from './dto/restock-item.dto';
import { UsageItemDto } from './dto/usage-item.dto';
import { InventoryStatusFilter, QueryInventoryDto } from './dto/query-inventory.dto';
import { QueryLogsDto } from './dto/query-logs.dto';
import type { AuthUser } from '../auth/strategies/jwt.strategy';

const ITEM_SELECT = {
  id: true,
  outletId: true,
  name: true,
  category: true,
  unit: true,
  currentStock: true,
  minStockAlert: true,
  avgDailyUsage: true,
  estimatedDaysLeft: true,
  lastRestockedAt: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

const LOG_SELECT = {
  id: true,
  itemId: true,
  type: true,
  quantity: true,
  stockBefore: true,
  stockAfter: true,
  unitCost: true,
  totalCost: true,
  supplier: true,
  notes: true,
  createdBy: true,
  createdByType: true,
  createdAt: true,
} as const;

type InventoryStatus = 'aman' | 'perhatian' | 'kritis';

function computeStatus(
  currentStock: { toString(): string },
  minStockAlert: { toString(): string },
): InventoryStatus {
  const stock = Number(currentStock.toString());
  const alert = Number(minStockAlert.toString());

  if (stock <= 0) return 'kritis';
  if (alert <= 0) return 'aman';
  if (stock <= alert * 0.5) return 'kritis';
  if (stock <= alert) return 'perhatian';
  return 'aman';
}

function calcEstimatedDays(
  currentStock: { toString(): string },
  avgDailyUsage: { toString(): string },
): number {
  const usage = Number(avgDailyUsage.toString());
  if (usage <= 0) return 0;
  return Math.floor(Number(currentStock.toString()) / usage);
}

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------------------------------------------------------
  // Helper: pastikan outlet memiliki plan Pro aktif
  // ----------------------------------------------------------------
  private async assertProPlan(outletId: string): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sub = await this.prisma.subscription.findFirst({
      where: {
        outletId,
        planType: 'pro',
        status: { in: ['active', 'grace_period'] },
        endDate: { gte: today },
      },
      select: { id: true },
    });

    if (!sub) {
      throw new ForbiddenException(
        'Fitur inventori hanya tersedia untuk paket Pro. Upgrade sekarang untuk mengakses fitur ini.',
      );
    }
  }

  // ----------------------------------------------------------------
  // Helper: ambil item + verifikasi kepemilikan outlet
  // ----------------------------------------------------------------
  private async findItemOrFail(outletId: string, itemId: string) {
    const item = await this.prisma.inventoryItem.findFirst({
      where: { id: itemId, outletId, isActive: true },
    });
    if (!item) {
      throw new NotFoundException('Item inventori tidak ditemukan');
    }
    return item;
  }

  // ----------------------------------------------------------------
  // GET /outlets/:id/inventory
  // ----------------------------------------------------------------
  async findAll(outletId: string, dto: QueryInventoryDto) {
    await this.assertProPlan(outletId);

    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;

    const items = await this.prisma.inventoryItem.findMany({
      where: {
        outletId,
        isActive: true,
        ...(dto.search && {
          name: { contains: dto.search, mode: 'insensitive' },
        }),
        ...(dto.category && {
          category: { equals: dto.category, mode: 'insensitive' },
        }),
      },
      orderBy: [{ name: 'asc' }],
      select: ITEM_SELECT,
    });

    // Hitung status dan filter
    const withStatus = items.map((item) => ({
      ...item,
      status: computeStatus(item.currentStock, item.minStockAlert),
    }));

    const filtered = dto.status
      ? withStatus.filter((item) => item.status === dto.status)
      : withStatus;

    // Paginate setelah filter status (karena status dihitung di JS)
    const total = filtered.length;
    const data = filtered.slice((page - 1) * limit, page * limit);

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

  // ----------------------------------------------------------------
  // POST /outlets/:id/inventory
  // ----------------------------------------------------------------
  async create(outletId: string, dto: CreateInventoryItemDto) {
    await this.assertProPlan(outletId);

    // Cek nama duplikat di outlet yang sama
    const existing = await this.prisma.inventoryItem.findFirst({
      where: {
        outletId,
        name: { equals: dto.name, mode: 'insensitive' },
        isActive: true,
      },
      select: { id: true },
    });
    if (existing) {
      throw new BadRequestException(
        `Item "${dto.name}" sudah ada di inventori outlet ini`,
      );
    }

    const currentStock = dto.currentStock ?? 0;
    const avgDailyUsage = dto.avgDailyUsage ?? 0;
    const estimatedDaysLeft =
      avgDailyUsage > 0 ? Math.floor(currentStock / avgDailyUsage) : 0;

    const item = await this.prisma.inventoryItem.create({
      data: {
        outletId,
        name: dto.name,
        category: dto.category,
        unit: dto.unit,
        currentStock,
        minStockAlert: dto.minStockAlert ?? 0,
        avgDailyUsage,
        estimatedDaysLeft,
      },
      select: ITEM_SELECT,
    });

    return { ...item, status: computeStatus(item.currentStock, item.minStockAlert) };
  }

  // ----------------------------------------------------------------
  // PATCH /outlets/:id/inventory/:itemId
  // ----------------------------------------------------------------
  async update(outletId: string, itemId: string, dto: UpdateInventoryItemDto) {
    await this.assertProPlan(outletId);
    const current = await this.findItemOrFail(outletId, itemId);

    // Cek nama duplikat jika nama diubah
    if (dto.name !== undefined) {
      const duplicate = await this.prisma.inventoryItem.findFirst({
        where: {
          outletId,
          name: { equals: dto.name, mode: 'insensitive' },
          isActive: true,
          id: { not: itemId },
        },
        select: { id: true },
      });
      if (duplicate) {
        throw new BadRequestException(
          `Item "${dto.name}" sudah ada di inventori outlet ini`,
        );
      }
    }

    // Recalculate estimatedDaysLeft jika avgDailyUsage berubah
    let estimatedDaysLeft: number | undefined;
    if (dto.avgDailyUsage !== undefined) {
      estimatedDaysLeft = calcEstimatedDays(
        current.currentStock,
        { toString: () => String(dto.avgDailyUsage) },
      );
    }

    const item = await this.prisma.inventoryItem.update({
      where: { id: itemId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.unit !== undefined && { unit: dto.unit }),
        ...(dto.minStockAlert !== undefined && { minStockAlert: dto.minStockAlert }),
        ...(dto.avgDailyUsage !== undefined && { avgDailyUsage: dto.avgDailyUsage }),
        ...(estimatedDaysLeft !== undefined && { estimatedDaysLeft }),
      },
      select: ITEM_SELECT,
    });

    return { ...item, status: computeStatus(item.currentStock, item.minStockAlert) };
  }

  // ----------------------------------------------------------------
  // POST /outlets/:id/inventory/:itemId/restock
  // ----------------------------------------------------------------
  async restock(
    outletId: string,
    itemId: string,
    dto: RestockItemDto,
    user: AuthUser,
  ) {
    await this.assertProPlan(outletId);
    const item = await this.findItemOrFail(outletId, itemId);

    const quantity = dto.quantity;
    const stockBefore = Number(item.currentStock.toString());
    const stockAfter = stockBefore + quantity;
    const unitCost = dto.unitCost ?? null;
    const totalCost = unitCost !== null ? unitCost * quantity : null;
    const estimatedDaysLeft = calcEstimatedDays(
      { toString: () => String(stockAfter) },
      item.avgDailyUsage,
    );

    await this.prisma.$transaction([
      this.prisma.inventoryLog.create({
        data: {
          itemId,
          type: 'in',
          quantity,
          stockBefore,
          stockAfter,
          unitCost,
          totalCost,
          supplier: dto.supplier,
          notes: dto.notes,
          createdBy: user.userId,
          createdByType: user.type,
        },
      }),
      this.prisma.inventoryItem.update({
        where: { id: itemId },
        data: {
          currentStock: stockAfter,
          estimatedDaysLeft,
          lastRestockedAt: dto.date ? new Date(dto.date) : new Date(),
        },
      }),
    ]);

    const updated = await this.prisma.inventoryItem.findUniqueOrThrow({
      where: { id: itemId },
      select: ITEM_SELECT,
    });

    return {
      ...updated,
      status: computeStatus(updated.currentStock, updated.minStockAlert),
    };
  }

  // ----------------------------------------------------------------
  // POST /outlets/:id/inventory/:itemId/usage
  // ----------------------------------------------------------------
  async usage(
    outletId: string,
    itemId: string,
    dto: UsageItemDto,
    user: AuthUser,
  ) {
    await this.assertProPlan(outletId);
    const item = await this.findItemOrFail(outletId, itemId);

    const quantity = dto.quantity;
    const stockBeforeNum = Number(item.currentStock.toString());

    if (stockBeforeNum < quantity) {
      throw new BadRequestException(
        `Stok tidak mencukupi. Stok saat ini: ${stockBeforeNum} ${item.unit}`,
      );
    }

    const stockBefore = stockBeforeNum;
    const stockAfter = stockBefore - quantity;
    const estimatedDaysLeft = calcEstimatedDays(
      { toString: () => String(stockAfter) },
      item.avgDailyUsage,
    );

    await this.prisma.$transaction([
      this.prisma.inventoryLog.create({
        data: {
          itemId,
          type: 'out',
          quantity,
          stockBefore,
          stockAfter,
          notes: dto.notes,
          createdBy: user.userId,
          createdByType: user.type,
        },
      }),
      this.prisma.inventoryItem.update({
        where: { id: itemId },
        data: {
          currentStock: stockAfter,
          estimatedDaysLeft,
        },
      }),
    ]);

    const updated = await this.prisma.inventoryItem.findUniqueOrThrow({
      where: { id: itemId },
      select: ITEM_SELECT,
    });

    return {
      ...updated,
      status: computeStatus(updated.currentStock, updated.minStockAlert),
    };
  }

  // ----------------------------------------------------------------
  // GET /outlets/:id/inventory/:itemId/logs
  // ----------------------------------------------------------------
  async getLogs(outletId: string, itemId: string, dto: QueryLogsDto) {
    await this.assertProPlan(outletId);
    // Verifikasi item milik outlet ini
    await this.findItemOrFail(outletId, itemId);

    const page = dto.page ?? 1;
    const limit = dto.limit ?? 30;
    const skip = (page - 1) * limit;

    const where = {
      itemId,
      ...(dto.type && { type: dto.type as 'in' | 'out' | 'adjustment' }),
      ...(dto.from || dto.to
        ? {
            createdAt: {
              ...(dto.from && { gte: new Date(dto.from) }),
              ...(dto.to && { lte: new Date(dto.to + 'T23:59:59.999Z') }),
            },
          }
        : {}),
    };

    const [total, logs] = await Promise.all([
      this.prisma.inventoryLog.count({ where }),
      this.prisma.inventoryLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: LOG_SELECT,
      }),
    ]);

    return {
      data: logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
