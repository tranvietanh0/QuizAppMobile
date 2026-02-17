import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";

export enum LeaderboardPeriod {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  ALL_TIME = "all_time",
}

export class LeaderboardFilterDto {
  @ApiPropertyOptional({
    description: "Time period for the leaderboard",
    enum: LeaderboardPeriod,
    default: LeaderboardPeriod.ALL_TIME,
    example: LeaderboardPeriod.WEEKLY,
  })
  @IsOptional()
  @IsEnum(LeaderboardPeriod)
  period?: LeaderboardPeriod = LeaderboardPeriod.ALL_TIME;

  @ApiPropertyOptional({
    description: "Maximum number of entries to return",
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: "Number of entries to skip",
    minimum: 0,
    default: 0,
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
