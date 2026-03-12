import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthUser } from '../../auth/strategies/jwt.strategy';

@Injectable()
export class OutletAccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<Request & { user: AuthUser; params: Record<string, string> }>();
    const outletId = req.params['id'] as string | undefined;

    if (!outletId) return true;

    const user = req.user;

    if (user.type === 'staff') {
      if (user.outletId !== outletId) {
        throw new ForbiddenException('Anda tidak memiliki akses ke outlet ini');
      }
      return true;
    }

    const outlet = await this.prisma.outlet.findUnique({
      where: { id: outletId },
      select: { userId: true, isActive: true },
    });

    if (!outlet || !outlet.isActive) {
      throw new NotFoundException('Outlet tidak ditemukan');
    }

    if (outlet.userId !== user.userId) {
      throw new ForbiddenException('Anda tidak memiliki akses ke outlet ini');
    }

    return true;
  }
}
