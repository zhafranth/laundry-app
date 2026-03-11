import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExpenseDto {
  @ApiProperty({ description: 'Tanggal pengeluaran (YYYY-MM-DD)' })
  @IsDateString()
  expenseDate: string;

  @ApiProperty({ description: 'ID kategori pengeluaran' })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({ description: 'ID subkategori pengeluaran' })
  @IsUUID()
  @IsOptional()
  subcategoryId?: string;

  @ApiProperty({ example: 350000, description: 'Jumlah pengeluaran' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount: number;

  @ApiPropertyOptional({ example: 'Beli deterjen 5 liter', description: 'Catatan' })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Apakah recurring' })
  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @ApiPropertyOptional({ example: 20, description: 'Hari recurring (1-31)' })
  @IsInt()
  @Min(1)
  @Max(31)
  @IsOptional()
  recurringDay?: number;
}
