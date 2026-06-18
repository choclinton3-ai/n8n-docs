import {
  IsEmail, IsString, MinLength, MaxLength,
  IsOptional, Matches, IsPhoneNumber,
} from 'class-validator'

export class RegisterDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase, and a number',
  })
  password: string

  @IsOptional()
  @IsString()
  phone?: string
}
