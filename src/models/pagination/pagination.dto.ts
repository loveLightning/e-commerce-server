import { IsOptional, IsString } from 'class-validator'

export class PaginationDto {
  @IsOptional()
  @IsString()
  public readonly page?: string

  @IsOptional()
  @IsString()
  public readonly perPage?: number
}
