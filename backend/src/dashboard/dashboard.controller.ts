import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { OutletAccessGuard } from '../finance/guards/outlet-access.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('outlets/:id/dashboard')
  @Roles('owner', 'staff')
  @UseGuards(OutletAccessGuard)
  @ApiOperation({ summary: 'Dashboard stats untuk 1 outlet' })
  getStats(@Param('id', ParseUUIDPipe) outletId: string) {
    return this.dashboardService.getStats(outletId);
  }

  @Get('outlets/overview')
  @Roles('owner')
  @ApiOperation({ summary: 'Overview multi-outlet (owner only)' })
  getOverview(@GetUser() user: AuthUser) {
    return this.dashboardService.getOverview(user.userId);
  }

  @Get('outlets/:id/reports/health-score')
  @Roles('owner')
  @UseGuards(OutletAccessGuard)
  @ApiOperation({ summary: 'Health score detail + trend (Pro only)' })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    description: 'Jumlah hari trend (default 30, max 90)',
  })
  getHealthScore(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Query('days') days?: string,
  ) {
    const trendDays = Math.min(
      Math.max(parseInt(days ?? '30', 10) || 30, 7),
      90,
    );
    return this.dashboardService.getHealthScore(outletId, trendDays);
  }
}
