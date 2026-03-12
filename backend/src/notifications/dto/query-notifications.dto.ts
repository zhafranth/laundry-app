import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum NotificationTypeFilter {
  order_new = 'order_new',
  order_deadline = 'order_deadline',
  order_overdue = 'order_overdue',
  stock_low = 'stock_low',
  expense_anomaly = 'expense_anomaly',
  subscription_expiring = 'subscription_expiring',
  subscription_expired = 'subscription_expired',
}

export class QueryNotificationsDto {
  @IsEnum(NotificationTypeFilter)
  @IsOptional()
  type?: NotificationTypeFilter;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;
}
