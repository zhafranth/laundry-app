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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum CreateOrderPaymentMethod {
  cash = 'cash',
  transfer = 'transfer',
  qris = 'qris',
}

export enum CreateOrderPaymentStatus {
  unpaid = 'unpaid',
  partial = 'partial',
  paid = 'paid',
}

export class CreateOrderItemDto {
  @ApiProperty({ description: 'ID layanan' })
  @IsUUID()
  serviceId: string;

  @ApiProperty({ example: 3.5, description: 'Jumlah (kg/pcs/meter)' })
  @IsNumber()
  @Min(0.01)
  quantity: number;

  @ApiPropertyOptional({ example: 15000, description: 'Override harga per unit (opsional)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  priceOverride?: number;

  @ApiPropertyOptional({ description: 'Catatan per item' })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  notes?: string;
}

export class CreateOrderDto {
  @ApiPropertyOptional({ description: 'ID pelanggan (opsional untuk walk-in)' })
  @IsUUID()
  @IsOptional()
  customerId?: string;

  @ApiProperty({ type: [CreateOrderItemDto], description: 'Daftar item order' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiPropertyOptional({ example: 0, description: 'Diskon (nominal)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discountAmount?: number;

  @ApiPropertyOptional({ enum: CreateOrderPaymentMethod })
  @IsEnum(CreateOrderPaymentMethod)
  @IsOptional()
  paymentMethod?: CreateOrderPaymentMethod;

  @ApiPropertyOptional({ enum: CreateOrderPaymentStatus, default: 'unpaid' })
  @IsEnum(CreateOrderPaymentStatus)
  @IsOptional()
  paymentStatus?: CreateOrderPaymentStatus;

  @ApiPropertyOptional({ example: 50000, description: 'Jumlah yang sudah dibayar' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  paidAmount?: number;

  @ApiPropertyOptional({ description: 'Estimasi selesai (ISO date string)' })
  @IsDateString()
  @IsOptional()
  estimatedDoneAt?: string;

  @ApiPropertyOptional({ description: 'Catatan order' })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  notes?: string;
}
