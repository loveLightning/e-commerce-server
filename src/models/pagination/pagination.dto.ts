import { IsOptional, IsString } from 'class-validator'

export class PaginationDto {
  @IsOptional()
  @IsString()
  public readonly page?: number

  @IsOptional()
  @IsString()
  public readonly perPage?: number
}
