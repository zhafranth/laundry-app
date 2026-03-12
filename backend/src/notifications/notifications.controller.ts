import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { OutletAccessGuard } from './guards/outlet-access.guard';
import { NotificationsService } from './notifications.service';
import { QueryNotificationsDto } from './dto/query-notifications.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, OutletAccessGuard)
@Roles('owner', 'staff')
@Controller('outlets/:id/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'List notifikasi (pagination + filter type)' })
  findAll(
    @Param('id', ParseUUIDPipe) outletId: string,
    @GetUser() user: AuthUser,
    @Query() query: QueryNotificationsDto,
  ) {
    return this.notificationsService.findAll(outletId, user, query);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Jumlah notifikasi belum dibaca' })
  getUnreadCount(
    @Param('id', ParseUUIDPipe) outletId: string,
    @GetUser() user: AuthUser,
  ) {
    return this.notificationsService.getUnreadCount(outletId, user);
  }

  @Patch(':notifId/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tandai 1 notifikasi sudah dibaca' })
  markRead(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('notifId', ParseUUIDPipe) notifId: string,
    @GetUser() user: AuthUser,
  ) {
    return this.notificationsService.markRead(outletId, notifId, user);
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tandai semua notifikasi sudah dibaca' })
  markAllRead(
    @Param('id', ParseUUIDPipe) outletId: string,
    @GetUser() user: AuthUser,
  ) {
    return this.notificationsService.markAllRead(outletId, user);
  }
}
