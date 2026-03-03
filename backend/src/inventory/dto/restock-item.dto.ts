import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RestockItemDto {
  @ApiProperty({ example: 10, description: 'Jumlah stok masuk' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  quantity: number;

  @ApiPropertyOptional({ example: 15000, description: 'Harga beli per unit (IDR)' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  unitCost?: number;

  @ApiPropertyOptional({ example: 'Toko Kimia', description: 'Nama supplier' })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  supplier?: string;

  @ApiPropertyOptional({ example: '2026-03-03', description: 'Tanggal restock (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({ example: 'Pembelian bulanan' })
  @IsString()
  @IsOptional()
  notes?: string;
}
