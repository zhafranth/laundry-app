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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateOrderPaymentDto } from './dto/update-order-payment.dto';
import { QueryOrdersDto } from './dto/query-orders.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, OutletAccessGuard)
@Controller('outlets/:id/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles('owner', 'staff')
  @ApiOperation({ summary: 'Buat order baru (multi-item)' })
  create(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Body() dto: CreateOrderDto,
    @GetUser() user: AuthUser,
  ) {
    return this.ordersService.create(outletId, dto, user);
  }

  @Get()
  @Roles('owner', 'staff')
  @ApiOperation({ summary: 'List orders (filter + search + pagination)' })
  findAll(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Query() query: QueryOrdersDto,
  ) {
    return this.ordersService.findAll(outletId, query);
  }

  @Get(':orderId/nota')
  @Roles('owner', 'staff')
  @ApiOperation({ summary: 'Data nota untuk print/PDF' })
  getNota(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ) {
    return this.ordersService.getNota(outletId, orderId);
  }

  @Get(':orderId')
  @Roles('owner', 'staff')
  @ApiOperation({ summary: 'Detail order + items + status history' })
  findOne(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ) {
    return this.ordersService.findOne(outletId, orderId);
  }

  @Patch(':orderId/status')
  @Roles('owner', 'staff')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update status order' })
  updateStatus(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() dto: UpdateOrderStatusDto,
    @GetUser() user: AuthUser,
  ) {
    return this.ordersService.updateStatus(outletId, orderId, dto, user);
  }

  @Patch(':orderId/payment')
  @Roles('owner', 'staff')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update pembayaran order' })
  updatePayment(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() dto: UpdateOrderPaymentDto,
  ) {
    return this.ordersService.updatePayment(outletId, orderId, dto);
  }

  @Patch(':orderId')
  @Roles('owner', 'staff')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Edit order (sebelum completed)' })
  update(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() dto: UpdateOrderDto,
    @GetUser() user: AuthUser,
  ) {
    return this.ordersService.update(outletId, orderId, dto, user);
  }

  @Delete(':orderId')
  @Roles('owner')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Batalkan order (owner only)' })
  cancel(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() dto: CancelOrderDto,
    @GetUser() user: AuthUser,
  ) {
    return this.ordersService.cancel(outletId, orderId, dto, user);
  }
}
