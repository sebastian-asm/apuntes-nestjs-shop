import { ApiProperty } from '@nestjs/swagger'

import { IsOptional, IsPositive, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class PaginationDto {
  @ApiProperty({ default: 10, description: 'Limite de productos para listar' })
  @IsOptional()
  @IsPositive()
  // tranformado la query params de string a number
  @Type(() => Number)
  limit?: number

  @ApiProperty({
    default: 0,
    description: 'Cantidad de productos a saltar por cada página'
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number
}
