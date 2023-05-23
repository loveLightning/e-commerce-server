import { IsOptional, IsString } from 'class-validator'

export class UserDto {
  @IsOptional()
  @IsString()
  public readonly name: string

  @IsOptional()
  @IsString()
  public readonly phone: string
}
