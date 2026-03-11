import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerSortBy, QueryCustomersDto, SortOrder } from './dto/query-customers.dto';
import { QueryCustomerOrdersDto } from './dto/query-customer-orders.dto';

const CUSTOMER_SELECT = {
  id: true,
  outletId: true,
  name: true,
  phone: true,
  address: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
} as const;

const ORDER_SELECT = {
  id: true,
  orderNumber: true,
  status: true,
  paymentStatus: true,
  paymentMethod: true,
  totalAmount: true,
  paidAmount: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  orderItems: {
    select: {
      id: true,
      serviceName: true,
      pricePerUnit: true,
      unit: true,
      quantity: true,
      subtotal: true,
    },
  },
} as const;

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------------------------------------------------------
  // Helper: cari customer dan pastikan milik outlet
  // ----------------------------------------------------------------
  private async findCustomerOrFail(outletId: string, customerId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, outletId },
      select: CUSTOMER_SELECT,
    });
    if (!customer) {
      throw new NotFoundException('Pelanggan tidak ditemukan');
    }
    return customer;
  }

  // ----------------------------------------------------------------
  // GET /outlets/:id/customers — list + search + sort + pagination
  // ----------------------------------------------------------------
  async findAll(outletId: string, dto: QueryCustomersDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;
    const sortBy = dto.sortBy ?? CustomerSortBy.name;
    const sortOrder = dto.sortOrder ?? SortOrder.asc;

    const searchWhere = dto.search
      ? {
          OR: [
            { name: { contains: dto.search, mode: 'insensitive' as const } },
            { phone: { contains: dto.search } },
          ],
        }
      : {};

    const baseWhere = { outletId, ...searchWhere };

    // Untuk sort by computed fields (totalOrders, totalSpending, lastOrderAt),
    // kita pakai raw aggregate. Untuk field biasa, pakai Prisma orderBy.
    const computedSorts = ['totalOrders', 'totalSpending', 'lastOrderAt'];

    if (computedSorts.includes(sortBy)) {
      // Ambil semua customers + aggregate order stats
      const [total, customers] = await Promise.all([
        this.prisma.customer.count({ where: baseWhere }),
        this.prisma.customer.findMany({
          where: baseWhere,
          select: {
            ...CUSTOMER_SELECT,
            _count: { select: { orders: true } },
            orders: {
              select: {
                totalAmount: true,
                createdAt: true,
              },
            },
          },
        }),
      ]);

      // Map ke format dengan computed fields
      const mapped = customers.map((c) => {
        const totalOrders = c._count.orders;
        const totalSpending = c.orders.reduce(
          (sum, o) => sum + Number(o.totalAmount.toString()),
          0,
        );
        const lastOrderAt =
          c.orders.length > 0
            ? c.orders.reduce(
                (latest, o) => (o.createdAt > latest ? o.createdAt : latest),
                c.orders[0].createdAt,
              )
            : null;

        const { _count, orders, ...rest } = c;
        return { ...rest, totalOrders, totalSpending, lastOrderAt };
      });

      // Sort
      mapped.sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'totalOrders') {
          cmp = a.totalOrders - b.totalOrders;
        } else if (sortBy === 'totalSpending') {
          cmp = a.totalSpending - b.totalSpending;
        } else if (sortBy === 'lastOrderAt') {
          const aTime = a.lastOrderAt?.getTime() ?? 0;
          const bTime = b.lastOrderAt?.getTime() ?? 0;
          cmp = aTime - bTime;
        }
        return sortOrder === 'desc' ? -cmp : cmp;
      });

      const data = mapped.slice(skip, skip + limit);

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

    // Simple sort (name, createdAt)
    const orderBy =
      sortBy === 'name'
        ? { name: sortOrder }
        : { createdAt: sortOrder };

    const [total, customers] = await Promise.all([
      this.prisma.customer.count({ where: baseWhere }),
      this.prisma.customer.findMany({
        where: baseWhere,
        orderBy,
        skip,
        take: limit,
        select: {
          ...CUSTOMER_SELECT,
          _count: { select: { orders: true } },
          orders: {
            select: {
              totalAmount: true,
              createdAt: true,
            },
          },
        },
      }),
    ]);

    const data = customers.map((c) => {
      const totalOrders = c._count.orders;
      const totalSpending = c.orders.reduce(
        (sum, o) => sum + Number(o.totalAmount.toString()),
        0,
      );
      const lastOrderAt =
        c.orders.length > 0
          ? c.orders.reduce(
              (latest, o) => (o.createdAt > latest ? o.createdAt : latest),
              c.orders[0].createdAt,
            )
          : null;

      const { _count, orders, ...rest } = c;
      return { ...rest, totalOrders, totalSpending, lastOrderAt };
    });

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
  // GET /outlets/:id/customers/search?q= — autocomplete
  // ----------------------------------------------------------------
  async search(outletId: string, q: string) {
    if (!q || q.trim().length === 0) return [];

    const customers = await this.prisma.customer.findMany({
      where: {
        outletId,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { phone: { contains: q } },
        ],
      },
      orderBy: { name: 'asc' },
      take: 10,
      select: {
        id: true,
        name: true,
        phone: true,
      },
    });

    return customers;
  }

  // ----------------------------------------------------------------
  // GET /outlets/:id/customers/:customerId
  // ----------------------------------------------------------------
  async findOne(outletId: string, customerId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, outletId },
      select: {
        ...CUSTOMER_SELECT,
        _count: { select: { orders: true } },
        orders: {
          select: {
            totalAmount: true,
            createdAt: true,
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Pelanggan tidak ditemukan');
    }

    const totalOrders = customer._count.orders;
    const totalSpending = customer.orders.reduce(
      (sum, o) => sum + Number(o.totalAmount.toString()),
      0,
    );
    const avgSpending = totalOrders > 0 ? totalSpending / totalOrders : 0;
    const lastOrderAt =
      customer.orders.length > 0
        ? customer.orders.reduce(
            (latest, o) => (o.createdAt > latest ? o.createdAt : latest),
            customer.orders[0].createdAt,
          )
        : null;

    const { _count, orders, ...rest } = customer;
    return {
      ...rest,
      totalOrders,
      totalSpending,
      avgSpending: Math.round(avgSpending),
      lastOrderAt,
    };
  }

  // ----------------------------------------------------------------
  // GET /outlets/:id/customers/:customerId/orders
  // ----------------------------------------------------------------
  async findOrders(
    outletId: string,
    customerId: string,
    dto: QueryCustomerOrdersDto,
  ) {
    await this.findCustomerOrFail(outletId, customerId);

    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = { customerId, outletId };

    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: ORDER_SELECT,
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
  // POST /outlets/:id/customers
  // ----------------------------------------------------------------
  async create(outletId: string, dto: CreateCustomerDto) {
    // Cek phone duplikat di outlet yang sama
    const existing = await this.prisma.customer.findFirst({
      where: { outletId, phone: dto.phone },
      select: { id: true },
    });
    if (existing) {
      throw new BadRequestException(
        `Pelanggan dengan nomor telepon ${dto.phone} sudah terdaftar di outlet ini`,
      );
    }

    const customer = await this.prisma.customer.create({
      data: {
        outletId,
        name: dto.name,
        phone: dto.phone,
        address: dto.address,
        notes: dto.notes,
      },
      select: CUSTOMER_SELECT,
    });

    return customer;
  }

  // ----------------------------------------------------------------
  // PATCH /outlets/:id/customers/:customerId
  // ----------------------------------------------------------------
  async update(outletId: string, customerId: string, dto: UpdateCustomerDto) {
    await this.findCustomerOrFail(outletId, customerId);

    // Cek phone duplikat jika phone diubah
    if (dto.phone !== undefined) {
      const duplicate = await this.prisma.customer.findFirst({
        where: {
          outletId,
          phone: dto.phone,
          id: { not: customerId },
        },
        select: { id: true },
      });
      if (duplicate) {
        throw new BadRequestException(
          `Pelanggan dengan nomor telepon ${dto.phone} sudah terdaftar di outlet ini`,
        );
      }
    }

    const customer = await this.prisma.customer.update({
      where: { id: customerId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
      select: CUSTOMER_SELECT,
    });

    return customer;
  }

  // ----------------------------------------------------------------
  // DELETE /outlets/:id/customers/:customerId
  // ----------------------------------------------------------------
  async remove(outletId: string, customerId: string) {
    await this.findCustomerOrFail(outletId, customerId);

    // Soft-unlink: set customer_id null di orders terkait, lalu hard delete customer
    // (karena Customer table tidak punya is_active — mengikuti schema design)
    await this.prisma.$transaction([
      this.prisma.order.updateMany({
        where: { customerId, outletId },
        data: { customerId: null },
      }),
      this.prisma.customer.delete({
        where: { id: customerId },
      }),
    ]);

    return { message: 'Pelanggan berhasil dihapus' };
  }
}
