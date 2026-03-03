import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateOutletDto {
  @ApiProperty({ example: 'Laundry Bersih Jaya' })
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'Jl. Sudirman No. 1, Jakarta' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: '081234567890' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;
}
