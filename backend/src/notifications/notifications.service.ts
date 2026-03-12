import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryNotificationsDto } from './dto/query-notifications.dto';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import type { NotificationType, Prisma } from '@prisma/client';

const NOTIFICATION_SELECT = {
  id: true,
  outletId: true,
  recipientType: true,
  recipientId: true,
  type: true,
  title: true,
  message: true,
  data: true,
  isRead: true,
  readAt: true,
  createdAt: true,
} as const;

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------------------------------------------------------
  // GET /outlets/:id/notifications
  // ----------------------------------------------------------------
  async findAll(outletId: string, user: AuthUser, dto: QueryNotificationsDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      outletId,
      recipientType: user.type,
      recipientId: user.userId,
      ...(dto.type && { type: dto.type }),
    };

    const [total, notifications] = await Promise.all([
      this.prisma.notification.count({ where }),
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: NOTIFICATION_SELECT,
      }),
    ]);

    return {
      data: notifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ----------------------------------------------------------------
  // GET /outlets/:id/notifications/unread-count
  // ----------------------------------------------------------------
  async getUnreadCount(outletId: string, user: AuthUser) {
    const count = await this.prisma.notification.count({
      where: {
        outletId,
        recipientType: user.type,
        recipientId: user.userId,
        isRead: false,
      },
    });

    return { unreadCount: count };
  }

  // ----------------------------------------------------------------
  // PATCH /outlets/:id/notifications/:notifId/read
  // ----------------------------------------------------------------
  async markRead(outletId: string, notifId: string, user: AuthUser) {
    const notif = await this.prisma.notification.findFirst({
      where: {
        id: notifId,
        outletId,
        recipientType: user.type,
        recipientId: user.userId,
      },
      select: { id: true, isRead: true },
    });

    if (!notif) {
      throw new NotFoundException('Notifikasi tidak ditemukan');
    }

    if (notif.isRead) {
      return { message: 'Notifikasi sudah dibaca' };
    }

    await this.prisma.notification.update({
      where: { id: notifId },
      data: { isRead: true, readAt: new Date() },
    });

    return { message: 'Notifikasi ditandai sudah dibaca' };
  }

  // ----------------------------------------------------------------
  // PATCH /outlets/:id/notifications/read-all
  // ----------------------------------------------------------------
  async markAllRead(outletId: string, user: AuthUser) {
    const result = await this.prisma.notification.updateMany({
      where: {
        outletId,
        recipientType: user.type,
        recipientId: user.userId,
        isRead: false,
      },
      data: { isRead: true, readAt: new Date() },
    });

    return { updated: result.count };
  }

  // ----------------------------------------------------------------
  // Trigger: create notification (called from other services/cron)
  // ----------------------------------------------------------------
  async create(params: {
    outletId: string;
    recipientType: 'owner' | 'staff';
    recipientId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, unknown>;
  }) {
    return this.prisma.notification.create({
      data: {
        outletId: params.outletId,
        recipientType: params.recipientType,
        recipientId: params.recipientId,
        type: params.type,
        title: params.title,
        message: params.message,
        data: (params.data ?? undefined) as Prisma.InputJsonValue | undefined,
      },
      select: NOTIFICATION_SELECT,
    });
  }

  // ----------------------------------------------------------------
  // Trigger: notify outlet owner (convenience method)
  // ----------------------------------------------------------------
  async notifyOwner(params: {
    outletId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, unknown>;
  }) {
    const outlet = await this.prisma.outlet.findUnique({
      where: { id: params.outletId },
      select: { userId: true },
    });

    if (!outlet) return;

    return this.create({
      outletId: params.outletId,
      recipientType: 'owner',
      recipientId: outlet.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      data: params.data,
    });
  }

  // ----------------------------------------------------------------
  // Trigger: notify all staff in an outlet
  // ----------------------------------------------------------------
  async notifyAllStaff(params: {
    outletId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, unknown>;
  }) {
    const staffList = await this.prisma.staff.findMany({
      where: { outletId: params.outletId, isActive: true },
      select: { id: true },
    });

    if (staffList.length === 0) return;

    await this.prisma.notification.createMany({
      data: staffList.map((s) => ({
        outletId: params.outletId,
        recipientType: 'staff' as const,
        recipientId: s.id,
        type: params.type,
        title: params.title,
        message: params.message,
        data: (params.data ?? undefined) as Prisma.InputJsonValue | undefined,
      })),
    });
  }
}
