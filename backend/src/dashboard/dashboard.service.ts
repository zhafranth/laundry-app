import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------------------------------------------------------
  // GET /outlets/:id/dashboard
  // ----------------------------------------------------------------
  async getStats(outletId: string) {
    const { start: todayStart, end: todayEnd } = this.getTodayRange();

    // Yesterday range for comparison
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = new Date(todayEnd);
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);

    // Current month range
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const isPro = await this.isProPlan(outletId);

    // Parallel queries for core metrics
    const [
      todayRevenueAgg,
      yesterdayRevenueAgg,
      activeOrdersCount,
      approachingDeadline,
      todayExpensesAgg,
      monthlyCustomersCount,
      recentOrders,
      revenueChart,
    ] = await Promise.all([
      // Today's revenue (paid orders)
      this.prisma.order.aggregate({
        where: {
          outletId,
          paymentStatus: 'paid',
          createdAt: { gte: todayStart, lte: todayEnd },
        },
        _sum: { totalAmount: true },
      }),
      // Yesterday's revenue (for change %)
      this.prisma.order.aggregate({
        where: {
          outletId,
          paymentStatus: 'paid',
          createdAt: { gte: yesterdayStart, lte: yesterdayEnd },
        },
        _sum: { totalAmount: true },
      }),
      // Active orders count
      this.prisma.order.count({
        where: {
          outletId,
          status: { in: ['pending', 'processing', 'ready'] },
        },
      }),
      // Approaching deadline (within 24h)
      this.prisma.order.count({
        where: {
          outletId,
          status: { in: ['pending', 'processing', 'ready'] },
          estimatedDoneAt: {
            gte: now,
            lte: new Date(now.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      }),
      // Today's expenses
      this.prisma.expense.aggregate({
        where: {
          outletId,
          expenseDate: { gte: todayStart, lte: todayEnd },
        },
        _sum: { amount: true },
      }),
      // Monthly unique customers
      this.prisma.order.findMany({
        where: {
          outletId,
          createdAt: { gte: monthStart },
          customerId: { not: null },
        },
        select: { customerId: true },
        distinct: ['customerId'],
      }),
      // Recent 5 orders
      this.getRecentOrders(outletId),
      // Revenue chart (7 days)
      this.getRevenueChart(outletId),
    ]);

    const todayRevenue = Number(
      (todayRevenueAgg._sum.totalAmount ?? 0).toString(),
    );
    const yesterdayRevenue = Number(
      (yesterdayRevenueAgg._sum.totalAmount ?? 0).toString(),
    );
    const todayRevenueChangePercent =
      yesterdayRevenue > 0
        ? Math.round(
            ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 1000,
          ) / 10
        : 0;

    // Pro-only features
    let healthScore: number | null = null;
    let healthScoreComponents: Record<string, number> | null = null;
    let insights: { id: string; text: string; type: string }[] = [];
    let alerts: { id: string; text: string; type: string }[] = [];

    if (isPro) {
      const proData = await this.getProFeatures(outletId);
      healthScore = proData.healthScore;
      healthScoreComponents = proData.healthScoreComponents;
      insights = proData.insights;
      alerts = proData.alerts;
    }

    return {
      todayRevenue,
      todayRevenueChangePercent,
      activeOrders: activeOrdersCount,
      approachingDeadlineCount: approachingDeadline,
      todayExpenses: Number(
        (todayExpensesAgg._sum.amount ?? 0).toString(),
      ),
      monthlyCustomers: monthlyCustomersCount.length,
      healthScore,
      healthScoreComponents,
      recentOrders,
      revenueChart,
      insights,
      alerts,
    };
  }

  // ----------------------------------------------------------------
  // GET /outlets/overview
  // ----------------------------------------------------------------
  async getOverview(userId: string) {
    // Get all active outlets for this owner
    const outlets = await this.prisma.outlet.findMany({
      where: { userId, isActive: true },
      select: {
        id: true,
        name: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const rows = await Promise.all(
      outlets.map(async (outlet) => {
        // Get subscription info
        const sub = await this.prisma.subscription.findFirst({
          where: {
            outletId: outlet.id,
            status: { in: ['active', 'grace_period'] },
          },
          orderBy: { endDate: 'desc' },
          select: {
            planType: true,
            endDate: true,
          },
        });

        // Determine subscription status
        let subscriptionStatus: 'active' | 'expiring' | 'expired' = 'expired';
        let subscriptionEndDate = '';
        let plan: 'regular' | 'pro' = 'regular';

        if (sub) {
          plan = sub.planType as 'regular' | 'pro';
          subscriptionEndDate = sub.endDate.toISOString().split('T')[0];
          const daysLeft = Math.ceil(
            (sub.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
          );
          if (daysLeft <= 0) {
            subscriptionStatus = 'expired';
          } else if (daysLeft <= 7) {
            subscriptionStatus = 'expiring';
          } else {
            subscriptionStatus = 'active';
          }
        }

        // Get monthly stats in parallel
        const [monthlyRevenueAgg, monthlyOrdersCount, activeOrdersCount] =
          await Promise.all([
            this.prisma.order.aggregate({
              where: {
                outletId: outlet.id,
                paymentStatus: 'paid',
                createdAt: { gte: monthStart },
              },
              _sum: { totalAmount: true },
            }),
            this.prisma.order.count({
              where: {
                outletId: outlet.id,
                createdAt: { gte: monthStart },
              },
            }),
            this.prisma.order.count({
              where: {
                outletId: outlet.id,
                status: { in: ['pending', 'processing', 'ready'] },
              },
            }),
          ]);

        return {
          id: outlet.id,
          name: outlet.name,
          plan,
          subscriptionStatus,
          subscriptionEndDate,
          monthlyRevenue: Number(
            (monthlyRevenueAgg._sum.totalAmount ?? 0).toString(),
          ),
          monthlyOrders: monthlyOrdersCount,
          activeOrders: activeOrdersCount,
        };
      }),
    );

    return rows;
  }

  // ----------------------------------------------------------------
  // Helper: check if outlet has Pro plan
  // ----------------------------------------------------------------
  private async isProPlan(outletId: string): Promise<boolean> {
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

    return !!sub;
  }

  // ----------------------------------------------------------------
  // Helper: get today's date range
  // ----------------------------------------------------------------
  private getTodayRange(): { start: Date; end: Date } {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // ----------------------------------------------------------------
  // Helper: recent 5 orders
  // ----------------------------------------------------------------
  private async getRecentOrders(outletId: string) {
    const orders = await this.prisma.order.findMany({
      where: { outletId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        totalAmount: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
        customer: {
          select: { name: true },
        },
        orderItems: {
          select: { serviceName: true },
        },
      },
    });

    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customer?.name ?? 'Walk-in',
      services: order.orderItems.map((item) => item.serviceName).join(', '),
      totalAmount: Number(order.totalAmount.toString()),
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt.toISOString(),
    }));
  }

  // ----------------------------------------------------------------
  // Helper: 7-day revenue chart
  // ----------------------------------------------------------------
  private async getRevenueChart(outletId: string) {
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const days: { date: string; label: string; start: Date; end: Date }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);

      days.push({
        date: d.toISOString().split('T')[0],
        label: dayNames[d.getDay()],
        start: d,
        end,
      });
    }

    // Get all paid orders in the 7-day range
    const orders = await this.prisma.order.findMany({
      where: {
        outletId,
        paymentStatus: 'paid',
        createdAt: {
          gte: days[0].start,
          lte: days[days.length - 1].end,
        },
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
    });

    // Group by date
    const revenueMap = new Map<string, number>();
    for (const order of orders) {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      revenueMap.set(
        dateStr,
        (revenueMap.get(dateStr) ?? 0) + Number(order.totalAmount.toString()),
      );
    }

    return days.map((day) => ({
      date: day.date,
      label: day.label,
      revenue: revenueMap.get(day.date) ?? 0,
    }));
  }

  // ----------------------------------------------------------------
  // Helper: Pro features (health score, insights, alerts)
  // ----------------------------------------------------------------
  private async getProFeatures(outletId: string) {
    // Get latest health score
    const latestScore = await this.prisma.healthScore.findFirst({
      where: { outletId },
      orderBy: { scoreDate: 'desc' },
    });

    // Get inventory items and filter critical ones in-memory
    // (Prisma can't do column-to-column comparison)
    const allItems = await this.prisma.inventoryItem.findMany({
      where: { outletId, isActive: true },
      select: {
        name: true,
        currentStock: true,
        minStockAlert: true,
        unit: true,
      },
    });

    const criticalItems = allItems.filter(
      (item) =>
        Number(item.currentStock.toString()) <=
        Number(item.minStockAlert.toString()),
    );

    // Build alerts
    const alerts: { id: string; text: string; type: 'stock' | 'expense' }[] =
      [];

    for (const item of criticalItems.slice(0, 3)) {
      alerts.push({
        id: `stock-${item.name}`,
        text: `Stok ${item.name} tinggal ${Number(item.currentStock.toString())} ${item.unit}`,
        type: 'stock',
      });
    }

    // Expense anomaly: check if today's expenses > 120% of daily average this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const { start: todayStart, end: todayEnd } = this.getTodayRange();
    const dayOfMonth = now.getDate();

    const [monthExpenseAgg, todayExpenseAgg] = await Promise.all([
      this.prisma.expense.aggregate({
        where: {
          outletId,
          expenseDate: { gte: monthStart, lt: todayStart },
        },
        _sum: { amount: true },
      }),
      this.prisma.expense.aggregate({
        where: {
          outletId,
          expenseDate: { gte: todayStart, lte: todayEnd },
        },
        _sum: { amount: true },
      }),
    ]);

    const monthTotal = Number(
      (monthExpenseAgg._sum.amount ?? 0).toString(),
    );
    const todayTotal = Number(
      (todayExpenseAgg._sum.amount ?? 0).toString(),
    );
    const dailyAvg = dayOfMonth > 1 ? monthTotal / (dayOfMonth - 1) : 0;

    if (dailyAvg > 0 && todayTotal > dailyAvg * 1.2) {
      alerts.push({
        id: 'expense-anomaly',
        text: `Pengeluaran hari ini (Rp ${todayTotal.toLocaleString('id-ID')}) melebihi rata-rata harian`,
        type: 'expense',
      });
    }

    // Build insights from health score data
    const insights: {
      id: string;
      text: string;
      type: 'success' | 'warning' | 'info';
    }[] = [];

    if (latestScore?.insights) {
      const rawInsights = latestScore.insights as Array<{
        text: string;
        type: string;
      }>;
      if (Array.isArray(rawInsights)) {
        for (const insight of rawInsights.slice(0, 3)) {
          insights.push({
            id: `insight-${insights.length}`,
            text: insight.text ?? String(insight),
            type:
              (insight.type as 'success' | 'warning' | 'info') ?? 'info',
          });
        }
      }
    }

    return {
      healthScore: latestScore?.overallScore ?? null,
      healthScoreComponents: latestScore
        ? {
            profitMargin: latestScore.profitMarginScore ?? 0,
            revenueTrend: latestScore.revenueTrendScore ?? 0,
            expenseRatio: latestScore.expenseRatioScore ?? 0,
            inventoryHealth: latestScore.inventoryScore ?? 0,
            completionRate: latestScore.completionRateScore ?? 0,
          }
        : null,
      insights,
      alerts,
    };
  }
}
