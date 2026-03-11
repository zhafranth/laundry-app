import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

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
}
