import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum ProfitPeriodType {
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
}

export class QueryProfitDto {
  @ApiPropertyOptional({ enum: ProfitPeriodType, description: 'Tipe periode' })
  @IsEnum(ProfitPeriodType)
  @IsOptional()
  periodType?: ProfitPeriodType;

  @ApiPropertyOptional({ description: 'Tanggal mulai periode (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Tanggal akhir periode (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
