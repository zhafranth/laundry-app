import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ClockOutDto {
  @ApiPropertyOptional({ example: 'Selesai shift' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  notes?: string;
}
