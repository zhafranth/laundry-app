import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateOrderItemDto, CreateOrderPaymentMethod } from './create-order.dto';

export class UpdateOrderDto {
  @ApiPropertyOptional({ description: 'ID pelanggan' })
  @IsUUID()
  @IsOptional()
  customerId?: string;

  @ApiPropertyOptional({ type: [CreateOrderItemDto], description: 'Daftar item (replace all)' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @IsOptional()
  items?: CreateOrderItemDto[];

  @ApiPropertyOptional({ example: 0, description: 'Diskon (nominal)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discountAmount?: number;

  @ApiPropertyOptional({ enum: CreateOrderPaymentMethod })
  @IsEnum(CreateOrderPaymentMethod)
  @IsOptional()
  paymentMethod?: CreateOrderPaymentMethod;

  @ApiPropertyOptional({ description: 'Estimasi selesai' })
  @IsDateString()
  @IsOptional()
  estimatedDoneAt?: string;

  @ApiPropertyOptional({ description: 'Catatan order' })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  notes?: string;
}
