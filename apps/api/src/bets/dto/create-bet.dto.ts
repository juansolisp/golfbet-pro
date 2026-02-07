import { IsEnum, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BetType } from '@prisma/client';

export class CreateBetDto {
  @IsEnum(BetType)
  type: BetType;

  @IsObject()
  config: Record<string, unknown>;
}
