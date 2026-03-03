import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LogoutDto {
  @ApiPropertyOptional({ description: 'If omitted, all sessions are revoked' })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
