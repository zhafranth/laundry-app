import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { OutletAccessGuard } from './guards/outlet-access.guard';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryCustomersDto } from './dto/query-customers.dto';
import { QueryCustomerOrdersDto } from './dto/query-customer-orders.dto';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, OutletAccessGuard)
@Controller('outlets/:id/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @Roles('owner', 'staff')
  @ApiOperation({ summary: 'List pelanggan (search + sort + pagination)' })
  findAll(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Query() query: QueryCustomersDto,
  ) {
    return this.customersService.findAll(outletId, query);
  }

  @Get('search')
  @Roles('owner', 'staff')
  @ApiOperation({ summary: 'Autocomplete pencarian pelanggan' })
  search(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Query('q') q: string,
  ) {
    return this.customersService.search(outletId, q);
  }

  @Get(':customerId')
  @Roles('owner', 'staff')
  @ApiOperation({ summary: 'Detail pelanggan + statistik' })
  findOne(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ) {
    return this.customersService.findOne(outletId, customerId);
  }

  @Get(':customerId/orders')
  @Roles('owner', 'staff')
  @ApiOperation({ summary: 'Riwayat order pelanggan (paginated)' })
  findOrders(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Query() query: QueryCustomerOrdersDto,
  ) {
    return this.customersService.findOrders(outletId, customerId, query);
  }

  @Post()
  @Roles('owner', 'staff')
  @ApiOperation({ summary: 'Tambah pelanggan baru' })
  create(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Body() dto: CreateCustomerDto,
  ) {
    return this.customersService.create(outletId, dto);
  }

  @Patch(':customerId')
  @Roles('owner')
  @ApiOperation({ summary: 'Update data pelanggan (owner only)' })
  update(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customersService.update(outletId, customerId, dto);
  }

  @Delete(':customerId')
  @Roles('owner')
  @ApiOperation({ summary: 'Hapus pelanggan (owner only)' })
  remove(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ) {
    return this.customersService.remove(outletId, customerId);
  }
}
