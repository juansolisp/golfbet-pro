import { IsString, IsEnum, IsArray, ArrayMinSize, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RoundType } from '@prisma/client';
import { CreateBetDto } from '../../bets/dto/create-bet.dto';

export class CreateRoundDto {
  @IsString()
  courseId: string;

  @IsString()
  groupId: string;

  @IsEnum(RoundType)
  type: RoundType;

  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  playerIds: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBetDto)
  bets?: CreateBetDto[];
}
