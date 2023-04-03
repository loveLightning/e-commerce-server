import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class UserDto {
  @IsEmail()
  public readonly email: string

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  public readonly password: string

  @IsOptional()
  @IsString()
  public readonly name: string

  @IsOptional()
  @IsString()
  public readonly avatarPath: string

  @IsOptional()
  @IsString()
  public readonly phone: string
}
