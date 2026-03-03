import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Patch,
  Post,
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
import { CreateServiceDto } from './dto/create-service.dto';
import { ReorderServicesDto } from './dto/reorder-services.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { OutletAccessGuard } from './guards/outlet-access.guard';
import { ServicesService } from './services.service';

@ApiTags('Services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, OutletAccessGuard)
@Controller('outlets/:id/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  /**
   * GET /outlets/:id/services
   * Owner: lihat semua (aktif + nonaktif)
   * Staff: lihat semua (gunakan ?active=true untuk filter aktif saja)
   */
  @Get()
  @Roles('owner', 'staff')
  @ApiOperation({ summary: 'List layanan outlet' })
  @ApiQuery({
    name: 'active',
    required: false,
    type: Boolean,
    description: 'Filter hanya layanan aktif',
  })
  findAll(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Query('active', new ParseBoolPipe({ optional: true })) activeOnly?: boolean,
  ) {
    return this.servicesService.findAll(outletId, activeOnly ?? false);
  }

  /**
   * POST /outlets/:id/services
   * Owner only
   */
  @Post()
  @Roles('owner')
  @ApiOperation({ summary: 'Tambah layanan baru' })
  create(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Body() dto: CreateServiceDto,
  ) {
    return this.servicesService.create(outletId, dto);
  }

  /**
   * PATCH /outlets/:id/services/reorder
   * Owner only — WAJIB sebelum /:serviceId agar tidak bentrok routing
   */
  @Patch('reorder')
  @Roles('owner')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update urutan tampil layanan (batch)' })
  reorder(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Body() dto: ReorderServicesDto,
  ) {
    return this.servicesService.reorder(outletId, dto);
  }

  /**
   * PATCH /outlets/:id/services/:serviceId
   * Owner only
   */
  @Patch(':serviceId')
  @Roles('owner')
  @ApiOperation({ summary: 'Update layanan' })
  update(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.update(outletId, serviceId, dto);
  }

  /**
   * DELETE /outlets/:id/services/:serviceId
   * Owner only — soft delete (isActive = false)
   */
  @Delete(':serviceId')
  @Roles('owner')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hapus layanan (soft delete)' })
  remove(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
  ) {
    return this.servicesService.remove(outletId, serviceId);
  }
}
