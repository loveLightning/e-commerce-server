import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class RegisterDto {
  @IsEmail()
  public readonly email: string

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  public readonly password: string

  @IsString()
  public readonly name: string
}

export class LoginDto {
  @IsEmail()
  public readonly email: string

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  public readonly password: string
}
