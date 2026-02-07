import { IsString, IsArray, ValidateNested, IsInt, Min, Max, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class ScoreEntry {
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

export class BulkSyncDto {
  @IsString()
  roundId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScoreEntry)
  scores: ScoreEntry[];
}
