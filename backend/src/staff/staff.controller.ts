import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateStaffDto } from './dto/create-staff.dto';
import { ResetPinDto } from './dto/reset-pin.dto';
import { ToggleStatusDto } from './dto/toggle-status.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { OutletAccessGuard } from './guards/outlet-access.guard';
import { StaffService } from './staff.service';

@ApiTags('Staff')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, OutletAccessGuard)
@Roles('owner')
@Controller('outlets/:id/staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah staff baru ke outlet' })
  create(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Body() dto: CreateStaffDto,
  ) {
    return this.staffService.create(outletId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List semua staff outlet (aktif & nonaktif)' })
  findAll(@Param('id', ParseUUIDPipe) outletId: string) {
    return this.staffService.findAll(outletId);
  }

  @Get(':staffId')
  @ApiOperation({ summary: 'Detail staff' })
  findOne(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('staffId', ParseUUIDPipe) staffId: string,
  ) {
    return this.staffService.findOne(outletId, staffId);
  }

  @Patch(':staffId')
  @ApiOperation({ summary: 'Edit info staff (nama, phone, role)' })
  update(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('staffId', ParseUUIDPipe) staffId: string,
    @Body() dto: UpdateStaffDto,
  ) {
    return this.staffService.update(outletId, staffId, dto);
  }

  @Patch(':staffId/pin')
  @ApiOperation({ summary: 'Reset PIN staff (cabut semua sesi aktif)' })
  resetPin(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('staffId', ParseUUIDPipe) staffId: string,
    @Body() dto: ResetPinDto,
  ) {
    return this.staffService.resetPin(outletId, staffId, dto);
  }

  @Patch(':staffId/status')
  @ApiOperation({ summary: 'Aktifkan / nonaktifkan staff' })
  toggleStatus(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('staffId', ParseUUIDPipe) staffId: string,
    @Body() dto: ToggleStatusDto,
  ) {
    return this.staffService.toggleStatus(outletId, staffId, dto);
  }

  @Delete(':staffId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hapus staff permanen (cascade attendance)' })
  remove(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('staffId', ParseUUIDPipe) staffId: string,
  ) {
    return this.staffService.remove(outletId, staffId);
  }
}
