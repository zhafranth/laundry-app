import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ClockInDto {
  @ApiPropertyOptional({ example: 'Shift pagi' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  notes?: string;
}
