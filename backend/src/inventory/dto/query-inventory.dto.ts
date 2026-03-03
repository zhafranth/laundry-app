import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum InventoryStatusFilter {
  aman = 'aman',
  perhatian = 'perhatian',
  kritis = 'kritis',
}

export class QueryInventoryDto {
  @ApiPropertyOptional({ description: 'Cari berdasarkan nama item' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter berdasarkan kategori' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ enum: InventoryStatusFilter, description: 'Filter berdasarkan status stok' })
  @IsEnum(InventoryStatusFilter)
  @IsOptional()
  status?: InventoryStatusFilter;

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
