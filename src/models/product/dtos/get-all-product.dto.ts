import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { PaginationDto } from 'src/models/pagination/pagination.dto'

export enum EnumProductSort {
  HIGH_PRICE = 'high-price',
  LOW_PRICE = 'low-price',
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

export class GetAllProductDto extends PaginationDto {
  @IsOptional()
  @IsEnum(EnumProductSort)
  public readonly sort?: EnumProductSort

  @IsOptional()
  @IsString()
  public readonly searchTerm?: string

  @IsOptional()
  @IsString()
  public readonly slug?: string
}
