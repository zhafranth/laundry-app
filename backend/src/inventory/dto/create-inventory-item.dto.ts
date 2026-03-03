import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInventoryItemDto {
  @ApiProperty({ example: 'Detergen Cair', description: 'Nama item inventori' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Bahan Cuci', description: 'Kategori item' })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  category?: string;

  @ApiProperty({ example: 'liter', description: 'Satuan item (kg, liter, pcs, dll)' })
  @IsString()
  @MaxLength(20)
  unit: string;

  @ApiPropertyOptional({ example: 5.5, description: 'Stok awal' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  currentStock?: number;

  @ApiPropertyOptional({ example: 2, description: 'Batas minimum stok sebelum alert' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  minStockAlert?: number;

  @ApiPropertyOptional({ example: 0.5, description: 'Rata-rata pemakaian per hari' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  avgDailyUsage?: number;
}
