import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum CustomerSortBy {
  name = 'name',
  createdAt = 'createdAt',
  totalOrders = 'totalOrders',
  totalSpending = 'totalSpending',
  lastOrderAt = 'lastOrderAt',
}

export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

export class QueryCustomersDto {
  @ApiPropertyOptional({ description: 'Cari berdasarkan nama atau nomor telepon' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: CustomerSortBy, default: CustomerSortBy.name })
  @IsEnum(CustomerSortBy)
  @IsOptional()
  sortBy?: CustomerSortBy;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.asc })
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
