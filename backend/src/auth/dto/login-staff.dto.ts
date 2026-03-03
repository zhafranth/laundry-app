import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, Length } from 'class-validator';

export class LoginStaffDto {
  @ApiProperty({ example: 'uuid-of-outlet' })
  @IsUUID()
  outletId: string;

  @ApiProperty({ example: 'kasir01' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '123456', description: '6-digit PIN' })
  @IsString()
  @Length(6, 6)
  pin: string;
}
