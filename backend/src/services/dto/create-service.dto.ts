import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceUnit } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Cuci Kering' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 5000, description: 'Harga per unit (IDR)' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    enum: ServiceUnit,
    default: ServiceUnit.kg,
    description: 'Satuan layanan: kg, pcs, atau meter',
  })
  @IsEnum(ServiceUnit)
  @IsOptional()
  unit?: ServiceUnit;

  @ApiPropertyOptional({
    example: 24,
    description: 'Estimasi jam pengerjaan',
    default: 24,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  estimatedHours?: number;

  @ApiPropertyOptional({
    example: 0,
    description: 'Urutan tampil (auto-append jika tidak diisi)',
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}
