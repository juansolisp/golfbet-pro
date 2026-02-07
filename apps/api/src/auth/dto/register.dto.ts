import { IsEmail, IsString, MinLength, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsNumber()
  @Min(-10)
  @Max(54)
  handicap?: number;
}
