import { IsString, IsInt, IsOptional, IsBoolean, Min, Max } from 'class-validator';

export class SubmitScoreDto {
  @IsString()
  roundId: string;

  @IsInt()
  @Min(1)
  @Max(18)
  hole: number;

  @IsInt()
  @Min(1)
  @Max(20)
  strokes: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  putts?: number;

  @IsOptional()
  @IsBoolean()
  fairwayHit?: boolean;

  @IsOptional()
  @IsBoolean()
  gir?: boolean;

  @IsOptional()
  @IsString()
  localId?: string;
}
