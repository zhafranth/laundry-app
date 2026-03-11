import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateOrderPaymentMethod } from './create-order.dto';

export class UpdateOrderPaymentDto {
  @ApiProperty({ example: 50000, description: 'Jumlah yang dibayar (ditambahkan ke paid_amount)' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({ enum: CreateOrderPaymentMethod })
  @IsEnum(CreateOrderPaymentMethod)
  @IsOptional()
  paymentMethod?: CreateOrderPaymentMethod;
}
