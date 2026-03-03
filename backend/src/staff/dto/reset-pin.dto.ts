import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class ResetPinDto {
  @ApiProperty({ example: '654321', description: 'PIN baru 6 digit angka' })
  @IsString()
  @Matches(/^\d{6}$/, { message: 'PIN harus 6 digit angka' })
  newPin: string;
}
