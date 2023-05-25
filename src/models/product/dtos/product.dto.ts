import { Type } from 'class-transformer'
import { IsNumber, IsString } from 'class-validator'

export class ProductDto {
  @IsString()
  public readonly name: string

  @IsString()
  public readonly desc: string

  @Type(() => Number)
  @IsNumber()
  public readonly price: number

  @IsString()
  public readonly category: string
}
