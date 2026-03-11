import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum OrderStatusValue {
  pending = 'pending',
  processing = 'processing',
  ready = 'ready',
  completed = 'completed',
  cancelled = 'cancelled',
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatusValue, description: 'Status baru' })
  @IsEnum(OrderStatusValue)
  status: OrderStatusValue;

  @ApiPropertyOptional({ description: 'Catatan perubahan status' })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  notes?: string;
}
