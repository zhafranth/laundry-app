import {
  Body,
  Controller,
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
import { InventoryService } from './inventory.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { RestockItemDto } from './dto/restock-item.dto';
import { UsageItemDto } from './dto/usage-item.dto';
import { QueryInventoryDto } from './dto/query-inventory.dto';
import { QueryLogsDto } from './dto/query-logs.dto';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, OutletAccessGuard)
@Controller('outlets/:id/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @Roles('owner', 'staff')
  @ApiOperation({ summary: 'List semua item inventori (Pro only)' })
  findAll(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Query() query: QueryInventoryDto,
  ) {
    return this.inventoryService.findAll(outletId, query);
  }

  @Post()
  @Roles('owner')
  @ApiOperation({ summary: 'Tambah item inventori baru (Pro only, owner only)' })
  create(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Body() dto: CreateInventoryItemDto,
  ) {
    return this.inventoryService.create(outletId, dto);
  }

  @Patch(':itemId')
  @Roles('owner')
  @ApiOperation({ summary: 'Update item inventori (Pro only, owner only)' })
  update(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: UpdateInventoryItemDto,
  ) {
    return this.inventoryService.update(outletId, itemId, dto);
  }

  @Post(':itemId/restock')
  @Roles('owner', 'staff')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Catat stok masuk / restock (Pro only)' })
  restock(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: RestockItemDto,
    @GetUser() user: AuthUser,
  ) {
    return this.inventoryService.restock(outletId, itemId, dto, user);
  }

  @Post(':itemId/usage')
  @Roles('owner', 'staff')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Catat pemakaian stok (Pro only)' })
  usage(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: UsageItemDto,
    @GetUser() user: AuthUser,
  ) {
    return this.inventoryService.usage(outletId, itemId, dto, user);
  }

  @Get(':itemId/logs')
  @Roles('owner', 'staff')
  @ApiOperation({ summary: 'Riwayat pergerakan stok (Pro only)' })
  getLogs(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Query() query: QueryLogsDto,
  ) {
    return this.inventoryService.getLogs(outletId, itemId, query);
  }
}
