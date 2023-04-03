import { Prisma } from '@prisma/client'
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class ProductDto implements Prisma.ProductUpdateInput {
  @IsNumber()
  public readonly price?: number | Prisma.IntFieldUpdateOperationsInput

  @IsOptional()
  @IsString()
  public readonly description?: string | Prisma.StringFieldUpdateOperationsInput

  @IsArray({ each: true })
  @ArrayMinSize(1)
  public readonly images?:
    | Prisma.ProductUpdateimagesInput
    | Prisma.Enumerable<string>

  @IsNumber()
  public readonly categoryId: number

  @IsString()
  public readonly name: string
}
