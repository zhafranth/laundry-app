import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { QueryIncomeDto } from './dto/query-income.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { QueryProfitDto } from './dto/query-profit.dto';

const EXPENSE_SELECT = {
  id: true,
  outletId: true,
  categoryId: true,
  subcategoryId: true,
  amount: true,
  expenseDate: true,
  notes: true,
  isRecurring: true,
  recurringDay: true,
  createdBy: true,
  createdByType: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  subcategory: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} as const;

@Injectable()
export class FinanceService {
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
        'Fitur profit hanya tersedia untuk paket Pro. Upgrade sekarang untuk mengakses fitur ini.',
      );
    }
  }

  // ----------------------------------------------------------------
  // Helper: find expense or fail
  // ----------------------------------------------------------------
  private async findExpenseOrFail(outletId: string, expenseId: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id: expenseId, outletId },
      select: EXPENSE_SELECT,
    });
    if (!expense) {
      throw new NotFoundException('Pengeluaran tidak ditemukan');
    }
    return expense;
  }

  // ----------------------------------------------------------------
  // Helper: format expense for response (convert Decimal)
  // ----------------------------------------------------------------
  private formatExpense(expense: any) {
    return {
      ...expense,
      amount: Number(expense.amount.toString()),
      categoryName: expense.category?.name ?? null,
      subcategoryName: expense.subcategory?.name ?? null,
    };
  }

  // ----------------------------------------------------------------
  // GET /outlets/:id/finance/income
  // ----------------------------------------------------------------
  async getIncome(outletId: string, dto: QueryIncomeDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;

    // Build where clause: only paid orders
    const where: Prisma.OrderWhereInput = {
      outletId,
      paymentStatus: 'paid',
    };

    if (dto.paymentMethod) {
      where.paymentMethod = dto.paymentMethod;
    }

    if (dto.startDate || dto.endDate) {
      where.createdAt = {};
      if (dto.startDate) {
        where.createdAt.gte = new Date(dto.startDate);
      }
      if (dto.endDate) {
        const end = new Date(dto.endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const [total, orders, aggregate] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          orderNumber: true,
          totalAmount: true,
          paidAmount: true,
          paymentMethod: true,
          createdAt: true,
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
          orderItems: {
            select: {
              serviceName: true,
              quantity: true,
              unit: true,
            },
          },
        },
      }),
      this.prisma.order.aggregate({
        where,
        _sum: { totalAmount: true },
        _count: true,
      }),
    ]);

    // Build transactions matching frontend IncomeTransaction shape
    const transactions = orders.map((order) => {
      const serviceSummary = order.orderItems
        .map((item) => `${item.serviceName} (${item.quantity} ${item.unit})`)
        .join(', ');

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customer?.name ?? 'Walk-in',
        serviceSummary,
        totalAmount: Number(order.totalAmount.toString()),
        paymentMethod: order.paymentMethod,
        paidAt: order.createdAt.toISOString(),
      };
    });

    // Build daily chart data
    const dailyChart = await this.buildDailyChart(outletId, dto);

    // Calculate previous period for change percentage
    const totalIncome = Number(
      (aggregate._sum.totalAmount ?? 0).toString(),
    );
    const totalTransactions = aggregate._count;

    // Compute change percent vs previous period
    const changePercent = await this.computeIncomeChange(
      outletId,
      dto,
      totalIncome,
    );

    return {
      summary: {
        totalIncome,
        totalIncomeChangePercent: changePercent,
        totalTransactions,
      },
      dailyChart,
      data: transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ----------------------------------------------------------------
  // Helper: build daily chart for income
  // ----------------------------------------------------------------
  private async buildDailyChart(outletId: string, dto: QueryIncomeDto) {
    // Determine date range (default to current month)
    const now = new Date();
    const startDate = dto.startDate
      ? new Date(dto.startDate)
      : new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = dto.endDate
      ? new Date(dto.endDate)
      : new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const orders = await this.prisma.order.findMany({
      where: {
        outletId,
        paymentStatus: 'paid',
        ...(dto.paymentMethod && { paymentMethod: dto.paymentMethod }),
        createdAt: {
          gte: startDate,
          lte: new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate(),
            23, 59, 59, 999,
          ),
        },
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
    });

    // Group by date
    const dailyMap = new Map<string, number>();
    for (const order of orders) {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      dailyMap.set(
        dateStr,
        (dailyMap.get(dateStr) ?? 0) + Number(order.totalAmount.toString()),
      );
    }

    // Build series for each day in range
    const chart: { date: string; label: string; amount: number }[] = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      chart.push({
        date: dateStr,
        label: String(current.getDate()),
        amount: dailyMap.get(dateStr) ?? 0,
      });
      current.setDate(current.getDate() + 1);
    }

    return chart;
  }

  // ----------------------------------------------------------------
  // Helper: compute income change vs previous period
  // ----------------------------------------------------------------
  private async computeIncomeChange(
    outletId: string,
    dto: QueryIncomeDto,
    currentTotal: number,
  ): Promise<number> {
    const now = new Date();
    const startDate = dto.startDate
      ? new Date(dto.startDate)
      : new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = dto.endDate
      ? new Date(dto.endDate)
      : new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const periodMs = endDate.getTime() - startDate.getTime();
    const prevStart = new Date(startDate.getTime() - periodMs - 86400000);
    const prevEnd = new Date(startDate.getTime() - 1);

    const prevAggregate = await this.prisma.order.aggregate({
      where: {
        outletId,
        paymentStatus: 'paid',
        ...(dto.paymentMethod && { paymentMethod: dto.paymentMethod }),
        createdAt: {
          gte: prevStart,
          lte: prevEnd,
        },
      },
      _sum: { totalAmount: true },
    });

    const prevTotal = Number(
      (prevAggregate._sum.totalAmount ?? 0).toString(),
    );
    if (prevTotal === 0) return 0;
    return Math.round(((currentTotal - prevTotal) / prevTotal) * 1000) / 10;
  }

  // ----------------------------------------------------------------
  // GET /outlets/:id/finance/expenses
  // ----------------------------------------------------------------
  async getExpenses(outletId: string, dto: QueryExpensesDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ExpenseWhereInput = { outletId };

    if (dto.categoryId) {
      where.categoryId = dto.categoryId;
    }

    if (dto.search) {
      where.notes = { contains: dto.search, mode: 'insensitive' };
    }

    if (dto.startDate || dto.endDate) {
      where.expenseDate = {};
      if (dto.startDate) {
        where.expenseDate.gte = new Date(dto.startDate);
      }
      if (dto.endDate) {
        where.expenseDate.lte = new Date(dto.endDate);
      }
    }

    const [total, expenses] = await Promise.all([
      this.prisma.expense.count({ where }),
      this.prisma.expense.findMany({
        where,
        orderBy: { expenseDate: 'desc' },
        skip,
        take: limit,
        select: EXPENSE_SELECT,
      }),
    ]);

    // Build summary
    const summary = await this.buildExpenseSummary(outletId, dto);

    // Build trend chart (last 6 months)
    const trend = await this.buildExpenseTrend(outletId);

    return {
      summary,
      trend,
      data: expenses.map((e) => this.formatExpense(e)),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ----------------------------------------------------------------
  // Helper: build expense summary
  // ----------------------------------------------------------------
  private async buildExpenseSummary(
    outletId: string,
    dto: QueryExpensesDto,
  ) {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [currentAgg, prevAgg, categoryBreakdown] = await Promise.all([
      this.prisma.expense.aggregate({
        where: {
          outletId,
          expenseDate: { gte: currentMonthStart, lte: currentMonthEnd },
        },
        _sum: { amount: true },
      }),
      this.prisma.expense.aggregate({
        where: {
          outletId,
          expenseDate: { gte: prevMonthStart, lte: prevMonthEnd },
        },
        _sum: { amount: true },
      }),
      this.prisma.expense.groupBy({
        by: ['categoryId'],
        where: {
          outletId,
          expenseDate: { gte: currentMonthStart, lte: currentMonthEnd },
        },
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } },
      }),
    ]);

    const currentTotal = Number(
      (currentAgg._sum.amount ?? 0).toString(),
    );
    const prevTotal = Number(
      (prevAgg._sum.amount ?? 0).toString(),
    );
    const changePercent =
      prevTotal > 0
        ? Math.round(((currentTotal - prevTotal) / prevTotal) * 1000) / 10
        : 0;

    // Highest category
    let highestCategory = '-';
    let highestCategoryAmount = 0;
    if (categoryBreakdown.length > 0) {
      const topCatId = categoryBreakdown[0].categoryId;
      highestCategoryAmount = Number(
        (categoryBreakdown[0]._sum.amount ?? 0).toString(),
      );
      const cat = await this.prisma.expenseCategory.findUnique({
        where: { id: topCatId },
        select: { name: true },
      });
      highestCategory = cat?.name ?? '-';
    }

    return {
      totalExpenses: currentTotal,
      totalExpensesChangePercent: changePercent,
      costPerKg: null,
      highestCategory,
      highestCategoryAmount,
    };
  }

  // ----------------------------------------------------------------
  // Helper: build expense trend (last 6 months)
  // ----------------------------------------------------------------
  private async buildExpenseTrend(outletId: string) {
    const now = new Date();
    const months: { start: Date; end: Date; label: string; key: string }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      months.push({
        start: d,
        end,
        label: monthNames[d.getMonth()],
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      });
    }

    // Get all categories for this outlet
    const categories = await this.prisma.expenseCategory.findMany({
      where: { outletId },
      select: { id: true, slug: true },
      orderBy: { sortOrder: 'asc' },
    });

    const catSlugMap = new Map(categories.map((c) => [c.id, c.slug]));

    // Get expenses for the full 6-month range
    const allExpenses = await this.prisma.expense.findMany({
      where: {
        outletId,
        expenseDate: {
          gte: months[0].start,
          lte: months[months.length - 1].end,
        },
      },
      select: {
        amount: true,
        expenseDate: true,
        categoryId: true,
      },
    });

    // Build trend series
    const trend = months.map((m) => {
      const monthExpenses = allExpenses.filter((e) => {
        const d = new Date(e.expenseDate);
        return d >= m.start && d <= m.end;
      });

      const entry: Record<string, any> = {
        month: m.key,
        label: m.label,
        total: 0,
      };

      for (const exp of monthExpenses) {
        const amount = Number(exp.amount.toString());
        entry.total += amount;
        const slug = catSlugMap.get(exp.categoryId) ?? 'lain_lain';
        entry[slug] = (entry[slug] ?? 0) + amount;
      }

      return entry;
    });

    return trend;
  }

  // ----------------------------------------------------------------
  // POST /outlets/:id/finance/expenses
  // ----------------------------------------------------------------
  async createExpense(
    outletId: string,
    dto: CreateExpenseDto,
    user: AuthUser,
  ) {
    // Validate category belongs to outlet
    const category = await this.prisma.expenseCategory.findFirst({
      where: { id: dto.categoryId, outletId },
      select: { id: true },
    });
    if (!category) {
      throw new BadRequestException(
        'Kategori pengeluaran tidak ditemukan di outlet ini',
      );
    }

    // Validate subcategory belongs to category (if provided)
    if (dto.subcategoryId) {
      const subcategory = await this.prisma.expenseSubcategory.findFirst({
        where: { id: dto.subcategoryId, categoryId: dto.categoryId },
        select: { id: true },
      });
      if (!subcategory) {
        throw new BadRequestException(
          'Subkategori tidak ditemukan atau tidak sesuai dengan kategori',
        );
      }
    }

    const expense = await this.prisma.expense.create({
      data: {
        outletId,
        categoryId: dto.categoryId,
        subcategoryId: dto.subcategoryId ?? null,
        amount: dto.amount,
        expenseDate: new Date(dto.expenseDate),
        notes: dto.notes,
        isRecurring: dto.isRecurring ?? false,
        recurringDay: dto.recurringDay ?? null,
        createdBy: user.userId,
        createdByType: user.type,
      },
      select: EXPENSE_SELECT,
    });

    return this.formatExpense(expense);
  }

  // ----------------------------------------------------------------
  // PATCH /outlets/:id/finance/expenses/:expenseId
  // ----------------------------------------------------------------
  async updateExpense(
    outletId: string,
    expenseId: string,
    dto: UpdateExpenseDto,
  ) {
    await this.findExpenseOrFail(outletId, expenseId);

    // Validate category if changed
    if (dto.categoryId) {
      const category = await this.prisma.expenseCategory.findFirst({
        where: { id: dto.categoryId, outletId },
        select: { id: true },
      });
      if (!category) {
        throw new BadRequestException(
          'Kategori pengeluaran tidak ditemukan di outlet ini',
        );
      }
    }

    // Validate subcategory if provided
    if (dto.subcategoryId) {
      const catId = dto.categoryId ?? (await this.findExpenseOrFail(outletId, expenseId)).categoryId;
      const subcategory = await this.prisma.expenseSubcategory.findFirst({
        where: { id: dto.subcategoryId, categoryId: catId },
        select: { id: true },
      });
      if (!subcategory) {
        throw new BadRequestException(
          'Subkategori tidak ditemukan atau tidak sesuai dengan kategori',
        );
      }
    }

    const updated = await this.prisma.expense.update({
      where: { id: expenseId },
      data: {
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        ...(dto.subcategoryId !== undefined && { subcategoryId: dto.subcategoryId ?? null }),
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.expenseDate !== undefined && { expenseDate: new Date(dto.expenseDate) }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        ...(dto.isRecurring !== undefined && { isRecurring: dto.isRecurring }),
        ...(dto.recurringDay !== undefined && { recurringDay: dto.recurringDay ?? null }),
      },
      select: EXPENSE_SELECT,
    });

    return this.formatExpense(updated);
  }

  // ----------------------------------------------------------------
  // DELETE /outlets/:id/finance/expenses/:expenseId
  // ----------------------------------------------------------------
  async deleteExpense(outletId: string, expenseId: string) {
    await this.findExpenseOrFail(outletId, expenseId);

    await this.prisma.expense.delete({
      where: { id: expenseId },
    });

    return { message: 'Pengeluaran berhasil dihapus' };
  }

  // ----------------------------------------------------------------
  // GET /outlets/:id/finance/expense-categories
  // ----------------------------------------------------------------
  async getExpenseCategories(outletId: string) {
    const categories = await this.prisma.expenseCategory.findMany({
      where: { outletId },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        outletId: true,
        name: true,
        slug: true,
        isDefault: true,
        sortOrder: true,
        subcategories: {
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            categoryId: true,
            name: true,
            slug: true,
            sortOrder: true,
          },
        },
      },
    });

    return categories;
  }

  // ----------------------------------------------------------------
  // GET /outlets/:id/finance/profit (Pro only)
  // ----------------------------------------------------------------
  async getProfit(outletId: string, dto: QueryProfitDto) {
    await this.assertProPlan(outletId);

    const periodType = dto.periodType ?? 'monthly';

    // Build where for profit_analysis
    const where: Prisma.ProfitAnalysisWhereInput = {
      outletId,
      periodType,
    };

    if (dto.startDate || dto.endDate) {
      where.periodStart = {};
      if (dto.startDate) {
        where.periodStart.gte = new Date(dto.startDate);
      }
      if (dto.endDate) {
        where.periodStart.lte = new Date(dto.endDate);
      }
    }

    const [profitData, allocations] = await Promise.all([
      this.prisma.profitAnalysis.findMany({
        where,
        orderBy: { profit: 'desc' },
        select: {
          id: true,
          serviceId: true,
          periodType: true,
          periodStart: true,
          periodEnd: true,
          totalOrders: true,
          totalQuantity: true,
          totalRevenue: true,
          allocatedCost: true,
          profit: true,
          marginPct: true,
          service: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.costAllocation.findMany({
        where: { outletId },
        select: {
          serviceId: true,
          allocationPct: true,
          service: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    // Format profit data matching frontend ProfitByService shape
    const profitByService = profitData.map((p) => ({
      serviceId: p.serviceId,
      serviceName: p.service?.name ?? 'Unknown',
      totalOrders: p.totalOrders,
      totalRevenue: Number(p.totalRevenue.toString()),
      estimatedCost: Number(p.allocatedCost.toString()),
      profit: Number(p.profit.toString()),
      marginPercent: Number(p.marginPct.toString()),
    }));

    // Format cost allocations matching frontend CostAllocation shape
    const costAllocations = allocations.map((a) => ({
      serviceId: a.serviceId,
      serviceName: a.service?.name ?? 'Unknown',
      allocationPercent: Number(a.allocationPct.toString()),
    }));

    return {
      data: profitByService,
      costAllocations,
    };
  }
}
