import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UsageItemDto {
  @ApiProperty({ example: 1.5, description: 'Jumlah stok yang digunakan' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  quantity: number;

  @ApiPropertyOptional({ example: '2026-03-03', description: 'Tanggal pemakaian (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({ example: 'Digunakan untuk order #ORD-0021' })
  @IsString()
  @IsOptional()
  notes?: string;
}
