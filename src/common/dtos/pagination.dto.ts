import { IsOptional, IsPositive, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  // tranformado la query params de string a number
  @Type(() => Number)
    limit?: number

  @IsOptional()
  @Min(0)
  @Type(() => Number)
    offset?: number
}
