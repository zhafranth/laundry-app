import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { AttendanceService } from './attendance.service';
import { ClockInDto } from './dto/clock-in.dto';
import { ClockOutDto } from './dto/clock-out.dto';
import { QueryAttendanceDto } from './dto/query-attendance.dto';
import { OutletAccessGuard } from './guards/outlet-access.guard';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, OutletAccessGuard)
@Roles('owner', 'staff')
@Controller('outlets/:id/attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('clock-in')
  @HttpCode(HttpStatus.OK)
  @Roles('staff')
  @ApiOperation({ summary: 'Staff clock-in (mulai sesi kerja)' })
  clockIn(
    @Param('id', ParseUUIDPipe) outletId: string,
    @GetUser() user: AuthUser,
    @Body() dto: ClockInDto,
  ) {
    return this.attendanceService.clockIn(outletId, user.userId, dto);
  }

  @Post('clock-out')
  @HttpCode(HttpStatus.OK)
  @Roles('staff')
  @ApiOperation({ summary: 'Staff clock-out (tutup sesi kerja)' })
  clockOut(
    @Param('id', ParseUUIDPipe) outletId: string,
    @GetUser() user: AuthUser,
    @Body() dto: ClockOutDto,
  ) {
    return this.attendanceService.clockOut(outletId, user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List attendance records (filter tanggal, staffId, pagination)' })
  findAll(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Query() query: QueryAttendanceDto,
  ) {
    return this.attendanceService.findAll(outletId, query);
  }
}
