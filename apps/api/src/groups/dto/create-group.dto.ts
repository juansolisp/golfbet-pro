import { IsString, MinLength, IsOptional, MaxLength } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;
}
