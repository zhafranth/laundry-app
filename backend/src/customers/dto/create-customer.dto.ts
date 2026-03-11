import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Budi Santoso', description: 'Nama pelanggan' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: '08123456789', description: 'Nomor telepon (unik per outlet)' })
  @IsString()
  @MaxLength(20)
  phone: string;

  @ApiPropertyOptional({ example: 'Jl. Merdeka No. 10', description: 'Alamat pelanggan' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'Pelanggan tetap', description: 'Catatan tambahan' })
  @IsString()
  @IsOptional()
  notes?: string;
}
