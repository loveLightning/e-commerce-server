import { IsNumber, IsString } from 'class-validator'

export class CreateProductDto {
  @IsString()
  public readonly name: string

  @IsString()
  public readonly desc: string

  @IsString()
  public readonly price: string

  @IsString()
  public readonly category: string
}
