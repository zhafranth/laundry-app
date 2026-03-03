import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsUUID, Min, ValidateNested } from 'class-validator';

export class ReorderItemDto {
  @ApiProperty({ description: 'ID layanan' })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 0, description: 'Urutan baru (0-based)' })
  @IsInt()
  @Min(0)
  sortOrder: number;
}

export class ReorderServicesDto {
  @ApiProperty({
    type: [ReorderItemDto],
    description: 'Array pasangan id + sortOrder baru',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items: ReorderItemDto[];
}
