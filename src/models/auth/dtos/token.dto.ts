import { IsString } from 'class-validator'

export class RefreshTokenDto {
  @IsString()
  public readonly refreshToken: string
}

export class AccessTokenDto {
  @IsString()
  public readonly accessToken: string
}
