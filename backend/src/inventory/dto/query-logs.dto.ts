import { IsEnum, IsInt, IsISO8601, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

enum LogTypeFilter {
  in = 'in',
  out = 'out',
  adjustment = 'adjustment',
}

export class QueryLogsDto {
  @ApiPropertyOptional({ enum: LogTypeFilter, description: 'Filter berdasarkan tipe log' })
  @IsEnum(LogTypeFilter)
  @IsOptional()
  type?: LogTypeFilter;

  @ApiPropertyOptional({ example: '2026-03-01', description: 'Filter dari tanggal (YYYY-MM-DD)' })
  @IsISO8601({ strict: false })
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({ example: '2026-03-31', description: 'Filter sampai tanggal (YYYY-MM-DD)' })
  @IsISO8601({ strict: false })
  @IsOptional()
  to?: string;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 30 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;
}
