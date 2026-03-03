import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ example: 'abc123...hex64chars' })
  @IsString()
  @IsNotEmpty()
  token: string;
}
