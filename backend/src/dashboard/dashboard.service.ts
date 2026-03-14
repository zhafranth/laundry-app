import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

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
      todayExpenses: Number((todayExpensesAgg._sum.amount ?? 0).toString()),
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

    const monthTotal = Number((monthExpenseAgg._sum.amount ?? 0).toString());
    const todayTotal = Number((todayExpenseAgg._sum.amount ?? 0).toString());
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
            text: insight.text ?? JSON.stringify(insight),
            type: (insight.type as 'success' | 'warning' | 'info') ?? 'info',
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

  // ================================================================
  // GET /outlets/:id/reports/health-score (Pro only)
  // ================================================================
  async getHealthScore(outletId: string, trendDays: number) {
    await this.assertProPlan(outletId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - trendDays + 1);

    // Latest score + trend data in parallel
    const [latestScore, trendScores] = await Promise.all([
      this.prisma.healthScore.findFirst({
        where: { outletId },
        orderBy: { scoreDate: 'desc' },
      }),
      this.prisma.healthScore.findMany({
        where: {
          outletId,
          scoreDate: { gte: startDate, lte: today },
        },
        orderBy: { scoreDate: 'asc' },
        select: {
          scoreDate: true,
          overallScore: true,
          profitMarginScore: true,
          revenueTrendScore: true,
          expenseRatioScore: true,
          inventoryScore: true,
          completionRateScore: true,
        },
      }),
    ]);

    // Calculate trend direction
    let trendDirection: 'up' | 'down' | 'stable' = 'stable';
    if (trendScores.length >= 2) {
      const recent = trendScores[trendScores.length - 1].overallScore;
      const older = trendScores[0].overallScore;
      if (recent > older + 2) trendDirection = 'up';
      else if (recent < older - 2) trendDirection = 'down';
    }

    return {
      current: latestScore
        ? {
            overallScore: latestScore.overallScore,
            scoreDate: latestScore.scoreDate.toISOString().split('T')[0],
            components: {
              profitMargin: latestScore.profitMarginScore ?? 0,
              revenueTrend: latestScore.revenueTrendScore ?? 0,
              expenseRatio: latestScore.expenseRatioScore ?? 0,
              inventoryHealth: latestScore.inventoryScore ?? 0,
              completionRate: latestScore.completionRateScore ?? 0,
            },
            insights: latestScore.insights ?? [],
          }
        : null,
      trend: trendScores.map((s) => ({
        date: s.scoreDate.toISOString().split('T')[0],
        overallScore: s.overallScore,
        profitMargin: s.profitMarginScore ?? 0,
        revenueTrend: s.revenueTrendScore ?? 0,
        expenseRatio: s.expenseRatioScore ?? 0,
        inventoryHealth: s.inventoryScore ?? 0,
        completionRate: s.completionRateScore ?? 0,
      })),
      trendDirection,
    };
  }

  // ================================================================
  // CRON: Daily health score snapshot — runs at 01:00 every day
  // ================================================================
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async cronHealthScoreSnapshot() {
    this.logger.log('⏰ Starting daily health score snapshot...');

    const proOutlets = await this.getProOutlets();

    let processed = 0;
    for (const outlet of proOutlets) {
      try {
        await this.calculateAndSaveHealthScore(outlet.id);
        processed++;
      } catch (error) {
        this.logger.error(
          `Failed to calculate health score for outlet ${outlet.id}: ${error}`,
        );
      }
    }

    this.logger.log(
      `✅ Health score snapshot complete: ${processed}/${proOutlets.length} outlets`,
    );
  }

  // ================================================================
  // CRON: Daily profit analysis refresh — runs at 02:00 every day
  // ================================================================
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cronProfitAnalysisRefresh() {
    this.logger.log('⏰ Starting daily profit analysis refresh...');

    const proOutlets = await this.getProOutlets();

    let processed = 0;
    for (const outlet of proOutlets) {
      try {
        await this.refreshProfitAnalysis(outlet.id);
        processed++;
      } catch (error) {
        this.logger.error(
          `Failed to refresh profit analysis for outlet ${outlet.id}: ${error}`,
        );
      }
    }

    this.logger.log(
      `✅ Profit analysis refresh complete: ${processed}/${proOutlets.length} outlets`,
    );
  }

  // ================================================================
  // Helper: assert Pro plan (throws ForbiddenException)
  // ================================================================
  private async assertProPlan(outletId: string): Promise<void> {
    const isPro = await this.isProPlan(outletId);
    if (!isPro) {
      throw new ForbiddenException(
        'Fitur Health Score hanya tersedia untuk paket Pro. Upgrade sekarang untuk mengakses fitur ini.',
      );
    }
  }

  // ================================================================
  // Helper: get all outlets with active Pro subscription
  // ================================================================
  private async getProOutlets() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const subs = await this.prisma.subscription.findMany({
      where: {
        planType: 'pro',
        status: { in: ['active', 'grace_period'] },
        endDate: { gte: today },
      },
      select: { outletId: true },
      distinct: ['outletId'],
    });

    return subs.map((s) => ({ id: s.outletId }));
  }

  // ================================================================
  // Core: Calculate and save health score for one outlet
  // ================================================================
  private async calculateAndSaveHealthScore(outletId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Gather all data in parallel
    const [
      revenueMonth,
      expenseMonth,
      revenuePrevWeek,
      revenueThisWeek,
      completedOrders,
      totalOrders,
      inventoryItems,
    ] = await Promise.all([
      // 1. Revenue last 30 days
      this.prisma.order.aggregate({
        where: {
          outletId,
          paymentStatus: 'paid',
          createdAt: { gte: thirtyDaysAgo },
        },
        _sum: { totalAmount: true },
      }),
      // 2. Expense last 30 days
      this.prisma.expense.aggregate({
        where: {
          outletId,
          expenseDate: { gte: thirtyDaysAgo },
        },
        _sum: { amount: true },
      }),
      // 3. Revenue previous week (for trend)
      this.prisma.order.aggregate({
        where: {
          outletId,
          paymentStatus: 'paid',
          createdAt: {
            gte: new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000),
            lt: sevenDaysAgo,
          },
        },
        _sum: { totalAmount: true },
      }),
      // 4. Revenue this week
      this.prisma.order.aggregate({
        where: {
          outletId,
          paymentStatus: 'paid',
          createdAt: { gte: sevenDaysAgo },
        },
        _sum: { totalAmount: true },
      }),
      // 5. Completed orders (30 days)
      this.prisma.order.count({
        where: {
          outletId,
          status: 'completed',
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      // 6. Total non-cancelled orders (30 days)
      this.prisma.order.count({
        where: {
          outletId,
          status: { not: 'cancelled' },
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      // 7. Inventory items
      this.prisma.inventoryItem.findMany({
        where: { outletId, isActive: true },
        select: { currentStock: true, minStockAlert: true },
      }),
    ]);

    const totalRev = Number((revenueMonth._sum.totalAmount ?? 0).toString());
    const totalExp = Number((expenseMonth._sum.amount ?? 0).toString());
    const prevWeekRev = Number(
      (revenuePrevWeek._sum.totalAmount ?? 0).toString(),
    );
    const thisWeekRev = Number(
      (revenueThisWeek._sum.totalAmount ?? 0).toString(),
    );

    // 1. Profit Margin Score (0-100)
    // margin% → score: >=30% = 100, 0% = 0
    const marginPct =
      totalRev > 0 ? ((totalRev - totalExp) / totalRev) * 100 : 0;
    const profitMarginScore = Math.round(
      Math.max(0, Math.min(100, (marginPct / 30) * 100)),
    );

    // 2. Revenue Trend Score (0-100)
    // week-over-week growth → score: >=20% growth = 100, -20% = 0, 0% = 50
    let revGrowthPct = 0;
    if (prevWeekRev > 0) {
      revGrowthPct = ((thisWeekRev - prevWeekRev) / prevWeekRev) * 100;
    } else if (thisWeekRev > 0) {
      revGrowthPct = 100;
    }
    const revenueTrendScore = Math.round(
      Math.max(0, Math.min(100, 50 + (revGrowthPct / 20) * 50)),
    );

    // 3. Expense Ratio Score (0-100)
    // lower expense ratio = better: <=30% = 100, >=80% = 0
    const expRatio = totalRev > 0 ? (totalExp / totalRev) * 100 : 100;
    const expenseRatioScore = Math.round(
      Math.max(0, Math.min(100, ((80 - expRatio) / 50) * 100)),
    );

    // 4. Inventory Score (0-100)
    // % of items above min stock threshold
    let inventoryScore = 100;
    if (inventoryItems.length > 0) {
      const healthyItems = inventoryItems.filter(
        (item) =>
          Number(item.currentStock.toString()) >
          Number(item.minStockAlert.toString()),
      );
      inventoryScore = Math.round(
        (healthyItems.length / inventoryItems.length) * 100,
      );
    }

    // 5. Completion Rate Score (0-100)
    const completionRateScore =
      totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 100;

    // Overall = weighted average
    const overallScore = Math.round(
      profitMarginScore * 0.25 +
        revenueTrendScore * 0.2 +
        expenseRatioScore * 0.2 +
        inventoryScore * 0.15 +
        completionRateScore * 0.2,
    );

    // Generate insights
    const insights: { text: string; type: 'success' | 'warning' | 'info' }[] =
      [];

    if (marginPct >= 25)
      insights.push({
        text: `Margin profit sehat di ${marginPct.toFixed(1)}%`,
        type: 'success',
      });
    else if (marginPct < 10 && totalRev > 0)
      insights.push({
        text: `Margin profit rendah (${marginPct.toFixed(1)}%), pertimbangkan optimasi biaya`,
        type: 'warning',
      });

    if (revGrowthPct >= 10)
      insights.push({
        text: `Revenue naik ${revGrowthPct.toFixed(1)}% vs minggu lalu`,
        type: 'success',
      });
    else if (revGrowthPct <= -10)
      insights.push({
        text: `Revenue turun ${Math.abs(revGrowthPct).toFixed(1)}% vs minggu lalu`,
        type: 'warning',
      });

    if (completionRateScore < 80 && totalOrders > 0)
      insights.push({
        text: `Tingkat penyelesaian order ${completionRateScore}%, perlu ditingkatkan`,
        type: 'warning',
      });

    if (inventoryScore < 70 && inventoryItems.length > 0)
      insights.push({
        text: `${Math.round((1 - inventoryScore / 100) * inventoryItems.length)} item stok di bawah batas minimum`,
        type: 'warning',
      });

    // Upsert (unique on outletId + scoreDate)
    await this.prisma.healthScore.upsert({
      where: {
        outletId_scoreDate: { outletId, scoreDate: today },
      },
      update: {
        overallScore,
        profitMarginScore,
        revenueTrendScore,
        expenseRatioScore,
        inventoryScore,
        completionRateScore,
        insights,
      },
      create: {
        outletId,
        scoreDate: today,
        overallScore,
        profitMarginScore,
        revenueTrendScore,
        expenseRatioScore,
        inventoryScore,
        completionRateScore,
        insights,
      },
    });
  }

  // ================================================================
  // Core: Refresh profit analysis for one outlet (daily period)
  // ================================================================
  private async refreshProfitAnalysis(outletId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get active services + cost allocations + expenses
    const [services, costAllocations, totalExpenses] = await Promise.all([
      this.prisma.service.findMany({
        where: { outletId, isActive: true },
        select: { id: true, name: true },
      }),
      this.prisma.costAllocation.findMany({
        where: { outletId },
        select: { serviceId: true, allocationPct: true },
      }),
      this.prisma.expense.aggregate({
        where: {
          outletId,
          expenseDate: { gte: thirtyDaysAgo, lte: today },
        },
        _sum: { amount: true },
      }),
    ]);

    const totalExp = Number((totalExpenses._sum.amount ?? 0).toString());

    // Build allocation map (serviceId → pct)
    const allocMap = new Map<string, number>();
    for (const ca of costAllocations) {
      allocMap.set(ca.serviceId, Number(ca.allocationPct.toString()));
    }

    // For each service, calculate revenue from completed/paid order_items
    for (const service of services) {
      const orderItems = await this.prisma.orderItem.findMany({
        where: {
          serviceId: service.id,
          order: {
            outletId,
            paymentStatus: 'paid',
            createdAt: { gte: thirtyDaysAgo, lte: today },
          },
        },
        select: {
          quantity: true,
          subtotal: true,
        },
      });

      const totalOrders = orderItems.length;
      const totalQuantity = orderItems.reduce(
        (sum, item) => sum + Number(item.quantity.toString()),
        0,
      );
      const totalRevenue = orderItems.reduce(
        (sum, item) => sum + Number(item.subtotal.toString()),
        0,
      );

      // Allocated cost = total expenses × allocation percentage
      const allocPct = allocMap.get(service.id) ?? 0;
      const allocatedCost = (totalExp * allocPct) / 100;

      const profit = totalRevenue - allocatedCost;
      const marginPct = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

      // Upsert monthly period
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      await this.prisma.profitAnalysis.upsert({
        where: {
          outletId_serviceId_periodType_periodStart: {
            outletId,
            serviceId: service.id,
            periodType: 'monthly',
            periodStart: monthStart,
          },
        },
        update: {
          periodEnd: monthEnd,
          totalOrders,
          totalQuantity,
          totalRevenue,
          allocatedCost,
          profit,
          marginPct: Math.round(marginPct * 100) / 100,
          calculatedAt: new Date(),
        },
        create: {
          outletId,
          serviceId: service.id,
          periodType: 'monthly',
          periodStart: monthStart,
          periodEnd: monthEnd,
          totalOrders,
          totalQuantity,
          totalRevenue,
          allocatedCost,
          profit,
          marginPct: Math.round(marginPct * 100) / 100,
        },
      });
    }
  }
}
