import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum OrderSortBy {
  createdAt = 'createdAt',
  orderNumber = 'orderNumber',
  totalAmount = 'totalAmount',
}

export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

export enum OrderStatusFilter {
  pending = 'pending',
  processing = 'processing',
  ready = 'ready',
  completed = 'completed',
  cancelled = 'cancelled',
}

export enum OrderPaymentStatusFilter {
  unpaid = 'unpaid',
  partial = 'partial',
  paid = 'paid',
}

export class QueryOrdersDto {
  @ApiPropertyOptional({ description: 'Cari nama pelanggan atau nomor order' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: OrderStatusFilter })
  @IsEnum(OrderStatusFilter)
  @IsOptional()
  status?: OrderStatusFilter;

  @ApiPropertyOptional({ enum: OrderPaymentStatusFilter })
  @IsEnum(OrderPaymentStatusFilter)
  @IsOptional()
  paymentStatus?: OrderPaymentStatusFilter;

  @ApiPropertyOptional({ description: 'Filter by service ID' })
  @IsUUID()
  @IsOptional()
  serviceId?: string;

  @ApiPropertyOptional({ description: 'Tanggal mulai (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Tanggal akhir (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ enum: OrderSortBy, default: OrderSortBy.createdAt })
  @IsEnum(OrderSortBy)
  @IsOptional()
  sortBy?: OrderSortBy;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.desc })
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;
}
