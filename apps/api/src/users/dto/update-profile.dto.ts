import { IsString, IsNumber, IsOptional, Max, Min, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsNumber()
  @Min(-10)
  @Max(54)
  handicap?: number;

  @IsOptional()
  @IsString()
  pushToken?: string;
}
