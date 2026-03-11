import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateOrderPaymentDto } from './dto/update-order-payment.dto';
import { OrderSortBy, QueryOrdersDto, SortOrder } from './dto/query-orders.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';

const ORDER_LIST_SELECT = {
  id: true,
  orderNumber: true,
  status: true,
  paymentStatus: true,
  paymentMethod: true,
  subtotal: true,
  discountAmount: true,
  totalAmount: true,
  paidAmount: true,
  notes: true,
  estimatedDoneAt: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
  customer: {
    select: {
      id: true,
      name: true,
      phone: true,
    },
  },
  orderItems: {
    select: {
      id: true,
      serviceId: true,
      serviceName: true,
      pricePerUnit: true,
      unit: true,
      quantity: true,
      subtotal: true,
      notes: true,
    },
  },
} as const;

const ORDER_DETAIL_SELECT = {
  ...ORDER_LIST_SELECT,
  cancelledAt: true,
  cancelReason: true,
  createdBy: true,
  createdByType: true,
  statusHistory: {
    select: {
      id: true,
      fromStatus: true,
      toStatus: true,
      changedBy: true,
      changedByType: true,
      notes: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' as const },
  },
} as const;

// Valid status transitions (linear flow + cancel)
const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['processing', 'cancelled'],
  processing: ['ready', 'cancelled'],
  ready: ['completed', 'cancelled'],
};

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------------------------------------------------------
  // Helper: find order or throw
  // ----------------------------------------------------------------
  private async findOrderOrFail(outletId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, outletId },
      select: ORDER_DETAIL_SELECT,
    });
    if (!order) {
      throw new NotFoundException('Order tidak ditemukan');
    }
    return order;
  }

  // ----------------------------------------------------------------
  // Helper: generate order number atomically
  // ----------------------------------------------------------------
  private async generateOrderNumber(
    tx: Prisma.TransactionClient,
    outletId: string,
  ): Promise<string> {
    // Upsert the sequence row: create if not exists, increment if exists
    const seq = await tx.orderSequence.upsert({
      where: { outletId },
      create: { outletId, lastNumber: 1 },
      update: { lastNumber: { increment: 1 } },
    });
    return `ORD-${String(seq.lastNumber).padStart(4, '0')}`;
  }

  // ----------------------------------------------------------------
  // Helper: resolve payment_status from amounts
  // ----------------------------------------------------------------
  private resolvePaymentStatus(
    paidAmount: number,
    totalAmount: number,
  ): 'unpaid' | 'partial' | 'paid' {
    if (paidAmount <= 0) return 'unpaid';
    if (paidAmount >= totalAmount) return 'paid';
    return 'partial';
  }

  // ----------------------------------------------------------------
  // POST /outlets/:id/orders — create order
  // ----------------------------------------------------------------
  async create(outletId: string, dto: CreateOrderDto, user: AuthUser) {
    // Validate customer if provided
    if (dto.customerId) {
      const customer = await this.prisma.customer.findFirst({
        where: { id: dto.customerId, outletId },
        select: { id: true },
      });
      if (!customer) {
        throw new BadRequestException('Pelanggan tidak ditemukan di outlet ini');
      }
    }

    // Validate all services exist and are active
    const serviceIds = dto.items.map((item) => item.serviceId);
    const services = await this.prisma.service.findMany({
      where: {
        id: { in: serviceIds },
        outletId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        unit: true,
        estimatedHours: true,
      },
    });

    const serviceMap = new Map(services.map((s) => [s.id, s]));
    for (const item of dto.items) {
      if (!serviceMap.has(item.serviceId)) {
        throw new BadRequestException(
          `Layanan dengan ID ${item.serviceId} tidak ditemukan atau tidak aktif`,
        );
      }
    }

    // Build order items with snapshots
    const orderItems = dto.items.map((item) => {
      const service = serviceMap.get(item.serviceId)!;
      const pricePerUnit = item.priceOverride ?? Number(service.price);
      const subtotal = pricePerUnit * item.quantity;

      return {
        serviceId: item.serviceId,
        serviceName: service.name,
        pricePerUnit,
        unit: service.unit,
        quantity: item.quantity,
        subtotal,
        notes: item.notes,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const discountAmount = dto.discountAmount ?? 0;
    const totalAmount = Math.max(subtotal - discountAmount, 0);
    const paidAmount = dto.paidAmount ?? 0;
    const paymentStatus = dto.paymentStatus ?? this.resolvePaymentStatus(paidAmount, totalAmount);

    // Calculate estimated_done_at from max estimated_hours if not provided
    let estimatedDoneAt: Date | null = null;
    if (dto.estimatedDoneAt) {
      estimatedDoneAt = new Date(dto.estimatedDoneAt);
    } else {
      const maxHours = Math.max(
        ...services.map((s) => s.estimatedHours ?? 24),
      );
      estimatedDoneAt = new Date(Date.now() + maxHours * 60 * 60 * 1000);
    }

    // Create order in transaction (atomic order number generation)
    const order = await this.prisma.$transaction(async (tx) => {
      const orderNumber = await this.generateOrderNumber(tx, outletId);

      const created = await tx.order.create({
        data: {
          outletId,
          customerId: dto.customerId ?? null,
          orderNumber,
          status: 'pending',
          paymentStatus,
          paymentMethod: dto.paymentMethod ?? null,
          subtotal,
          discountAmount,
          totalAmount,
          paidAmount,
          notes: dto.notes,
          estimatedDoneAt,
          createdBy: user.userId,
          createdByType: user.type,
          orderItems: {
            create: orderItems,
          },
          statusHistory: {
            create: {
              fromStatus: null,
              toStatus: 'pending',
              changedBy: user.userId,
              changedByType: user.type,
              notes: 'Order dibuat',
            },
          },
        },
        select: ORDER_DETAIL_SELECT,
      });

      return created;
    });

    return order;
  }

  // ----------------------------------------------------------------
  // GET /outlets/:id/orders — list with filters
  // ----------------------------------------------------------------
  async findAll(outletId: string, dto: QueryOrdersDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;
    const sortBy = dto.sortBy ?? OrderSortBy.createdAt;
    const sortOrder = dto.sortOrder ?? SortOrder.desc;

    // Build where clause
    const where: Prisma.OrderWhereInput = { outletId };

    if (dto.status) {
      where.status = dto.status;
    }

    if (dto.paymentStatus) {
      where.paymentStatus = dto.paymentStatus;
    }

    if (dto.startDate || dto.endDate) {
      where.createdAt = {};
      if (dto.startDate) {
        where.createdAt.gte = new Date(dto.startDate);
      }
      if (dto.endDate) {
        // End of day
        const end = new Date(dto.endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    if (dto.serviceId) {
      where.orderItems = {
        some: { serviceId: dto.serviceId },
      };
    }

    if (dto.search) {
      where.OR = [
        { orderNumber: { contains: dto.search, mode: 'insensitive' } },
        {
          customer: {
            name: { contains: dto.search, mode: 'insensitive' },
          },
        },
      ];
    }

    // OrderBy
    const orderBy: Prisma.OrderOrderByWithRelationInput =
      sortBy === 'orderNumber'
        ? { orderNumber: sortOrder }
        : sortBy === 'totalAmount'
          ? { totalAmount: sortOrder }
          : { createdAt: sortOrder };

    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: ORDER_LIST_SELECT,
      }),
    ]);

    return {
      data: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ----------------------------------------------------------------
  // GET /outlets/:id/orders/:orderId — detail
  // ----------------------------------------------------------------
  async findOne(outletId: string, orderId: string) {
    return this.findOrderOrFail(outletId, orderId);
  }

  // ----------------------------------------------------------------
  // PATCH /outlets/:id/orders/:orderId — edit order
  // ----------------------------------------------------------------
  async update(
    outletId: string,
    orderId: string,
    dto: UpdateOrderDto,
    user: AuthUser,
  ) {
    const existing = await this.findOrderOrFail(outletId, orderId);

    if (existing.status === 'completed' || existing.status === 'cancelled') {
      throw new BadRequestException(
        'Order yang sudah selesai atau dibatalkan tidak dapat diedit',
      );
    }

    // Validate customer if changed
    if (dto.customerId !== undefined) {
      if (dto.customerId) {
        const customer = await this.prisma.customer.findFirst({
          where: { id: dto.customerId, outletId },
          select: { id: true },
        });
        if (!customer) {
          throw new BadRequestException('Pelanggan tidak ditemukan di outlet ini');
        }
      }
    }

    // If items are updated, recalculate everything
    if (dto.items) {
      const serviceIds = dto.items.map((item) => item.serviceId);
      const services = await this.prisma.service.findMany({
        where: { id: { in: serviceIds }, outletId, isActive: true },
        select: { id: true, name: true, price: true, unit: true },
      });

      const serviceMap = new Map(services.map((s) => [s.id, s]));
      for (const item of dto.items) {
        if (!serviceMap.has(item.serviceId)) {
          throw new BadRequestException(
            `Layanan dengan ID ${item.serviceId} tidak ditemukan atau tidak aktif`,
          );
        }
      }

      const orderItems = dto.items.map((item) => {
        const service = serviceMap.get(item.serviceId)!;
        const pricePerUnit = item.priceOverride ?? Number(service.price);
        const subtotal = pricePerUnit * item.quantity;
        return {
          serviceId: item.serviceId,
          serviceName: service.name,
          pricePerUnit,
          unit: service.unit,
          quantity: item.quantity,
          subtotal,
          notes: item.notes,
        };
      });

      const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
      const discountAmount = dto.discountAmount ?? Number(existing.discountAmount);
      const totalAmount = Math.max(subtotal - discountAmount, 0);
      const currentPaid = Number(existing.paidAmount);
      const paymentStatus = this.resolvePaymentStatus(currentPaid, totalAmount);

      // Replace items in transaction
      const updated = await this.prisma.$transaction(async (tx) => {
        // Delete old items
        await tx.orderItem.deleteMany({ where: { orderId } });

        return tx.order.update({
          where: { id: orderId },
          data: {
            ...(dto.customerId !== undefined && { customerId: dto.customerId || null }),
            ...(dto.paymentMethod !== undefined && { paymentMethod: dto.paymentMethod }),
            ...(dto.estimatedDoneAt !== undefined && {
              estimatedDoneAt: new Date(dto.estimatedDoneAt),
            }),
            ...(dto.notes !== undefined && { notes: dto.notes }),
            subtotal,
            discountAmount,
            totalAmount,
            paymentStatus,
            orderItems: { create: orderItems },
          },
          select: ORDER_DETAIL_SELECT,
        });
      });

      return updated;
    }

    // Simple update (no items change)
    const updateData: Prisma.OrderUpdateInput = {};
    if (dto.customerId !== undefined) updateData.customer = dto.customerId
      ? { connect: { id: dto.customerId } }
      : { disconnect: true };
    if (dto.paymentMethod !== undefined) updateData.paymentMethod = dto.paymentMethod;
    if (dto.estimatedDoneAt !== undefined) updateData.estimatedDoneAt = new Date(dto.estimatedDoneAt);
    if (dto.notes !== undefined) updateData.notes = dto.notes;

    if (dto.discountAmount !== undefined) {
      const subtotal = Number(existing.subtotal);
      const totalAmount = Math.max(subtotal - dto.discountAmount, 0);
      const currentPaid = Number(existing.paidAmount);
      updateData.discountAmount = dto.discountAmount;
      updateData.totalAmount = totalAmount;
      updateData.paymentStatus = this.resolvePaymentStatus(currentPaid, totalAmount);
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: updateData,
      select: ORDER_DETAIL_SELECT,
    });

    return updated;
  }

  // ----------------------------------------------------------------
  // PATCH /outlets/:id/orders/:orderId/status — update status
  // ----------------------------------------------------------------
  async updateStatus(
    outletId: string,
    orderId: string,
    dto: UpdateOrderStatusDto,
    user: AuthUser,
  ) {
    const existing = await this.findOrderOrFail(outletId, orderId);

    const currentStatus = existing.status;
    const newStatus = dto.status;

    if (currentStatus === newStatus) {
      throw new BadRequestException(`Order sudah berstatus ${currentStatus}`);
    }

    // Validate transition
    const allowed = VALID_TRANSITIONS[currentStatus];
    if (!allowed || !allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Tidak dapat mengubah status dari ${currentStatus} ke ${newStatus}`,
      );
    }

    const updateData: Prisma.OrderUpdateInput = {
      status: newStatus,
      statusHistory: {
        create: {
          fromStatus: currentStatus,
          toStatus: newStatus,
          changedBy: user.userId,
          changedByType: user.type,
          notes: dto.notes,
        },
      },
    };

    if (newStatus === 'completed') {
      updateData.completedAt = new Date();
    }

    if (newStatus === 'cancelled') {
      updateData.cancelledAt = new Date();
      updateData.cancelReason = dto.notes;
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: updateData,
      select: ORDER_DETAIL_SELECT,
    });

    return updated;
  }

  // ----------------------------------------------------------------
  // PATCH /outlets/:id/orders/:orderId/payment — update payment
  // ----------------------------------------------------------------
  async updatePayment(
    outletId: string,
    orderId: string,
    dto: UpdateOrderPaymentDto,
  ) {
    const existing = await this.findOrderOrFail(outletId, orderId);

    if (existing.status === 'cancelled') {
      throw new BadRequestException('Tidak dapat memperbarui pembayaran untuk order yang dibatalkan');
    }

    const currentPaid = Number(existing.paidAmount);
    const totalAmount = Number(existing.totalAmount);
    const newPaidAmount = currentPaid + dto.amount;
    const paymentStatus = this.resolvePaymentStatus(newPaidAmount, totalAmount);

    const updateData: Prisma.OrderUpdateInput = {
      paidAmount: newPaidAmount,
      paymentStatus,
    };

    if (dto.paymentMethod) {
      updateData.paymentMethod = dto.paymentMethod;
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: updateData,
      select: ORDER_DETAIL_SELECT,
    });

    return updated;
  }

  // ----------------------------------------------------------------
  // DELETE /outlets/:id/orders/:orderId — cancel order
  // ----------------------------------------------------------------
  async cancel(
    outletId: string,
    orderId: string,
    dto: CancelOrderDto,
    user: AuthUser,
  ) {
    const existing = await this.findOrderOrFail(outletId, orderId);

    if (existing.status === 'completed') {
      throw new BadRequestException('Order yang sudah selesai tidak dapat dibatalkan');
    }

    if (existing.status === 'cancelled') {
      throw new BadRequestException('Order sudah dibatalkan');
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelReason: dto.reason,
        statusHistory: {
          create: {
            fromStatus: existing.status,
            toStatus: 'cancelled',
            changedBy: user.userId,
            changedByType: user.type,
            notes: dto.reason ?? 'Order dibatalkan',
          },
        },
      },
      select: ORDER_DETAIL_SELECT,
    });

    return updated;
  }

  // ----------------------------------------------------------------
  // GET /outlets/:id/orders/:orderId/nota — nota data
  // ----------------------------------------------------------------
  async getNota(outletId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, outletId },
      select: {
        ...ORDER_DETAIL_SELECT,
        outlet: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            logoUrl: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order tidak ditemukan');
    }

    return order;
  }
}
