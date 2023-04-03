import { IsInt, IsString, Max, Min } from 'class-validator'

export class ReviewDto {
  @IsString()
  public readonly text: string

  @IsInt()
  @Min(1)
  @Max(5)
  public readonly rating: number
}
