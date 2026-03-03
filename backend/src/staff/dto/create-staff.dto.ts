import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StaffRole } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateStaffDto {
  @ApiProperty({ example: 'Budi Santoso' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: '081234567890' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ example: 'budi_kasir' })
  @IsString()
  @MaxLength(50)
  @Matches(/^[a-z0-9_]+$/, {
    message: 'Username hanya boleh huruf kecil, angka, dan underscore',
  })
  username: string;

  @ApiProperty({ example: '123456', description: 'PIN 6 digit angka' })
  @IsString()
  @Matches(/^\d{6}$/, { message: 'PIN harus 6 digit angka' })
  pin: string;

  @ApiPropertyOptional({ enum: StaffRole, default: StaffRole.kasir })
  @IsEnum(StaffRole)
  @IsOptional()
  role?: StaffRole;
}
