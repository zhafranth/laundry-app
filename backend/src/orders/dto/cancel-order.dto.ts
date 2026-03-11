import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CancelOrderDto {
  @ApiPropertyOptional({ description: 'Alasan pembatalan' })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  reason?: string;
}
