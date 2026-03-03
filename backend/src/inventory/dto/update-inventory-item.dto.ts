import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInventoryItemDto {
  @ApiPropertyOptional({ example: 'Detergen Cair' })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Bahan Cuci' })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 'liter' })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  minStockAlert?: number;

  @ApiPropertyOptional({ example: 0.5 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  avgDailyUsage?: number;
}
