import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCustomerDto {
  @ApiPropertyOptional({ example: 'Budi Santoso' })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: '08123456789' })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Jl. Merdeka No. 10' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'Pelanggan tetap' })
  @IsString()
  @IsOptional()
  notes?: string;
}
