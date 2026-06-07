import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator'

export class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  password: string

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string
}

export class ResetPasswordDto {
  @IsString()
  token: string

  @IsString()
  @MinLength(8)
  password: string
}

export class ChangePasswordDto {
  @IsString()
  currentPassword: string

  @IsString()
  @MinLength(8)
  newPassword: string
}
