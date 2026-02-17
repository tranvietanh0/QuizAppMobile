import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { LeaderboardEntryDto } from "./leaderboard-entry.dto";
import { LeaderboardPeriod } from "./leaderboard-filter.dto";

export class LeaderboardResponseDto {
  @ApiProperty({
    description: "List of leaderboard entries",
    type: [LeaderboardEntryDto],
  })
  entries: LeaderboardEntryDto[];

  @ApiPropertyOptional({
    description: "Current authenticated user's rank (if authenticated)",
    type: LeaderboardEntryDto,
    nullable: true,
  })
  userRank?: LeaderboardEntryDto | null;

  @ApiProperty({
    description: "Total number of users in the leaderboard",
    example: 150,
  })
  total: number;

  @ApiProperty({
    description: "Time period for this leaderboard",
    enum: LeaderboardPeriod,
    example: LeaderboardPeriod.WEEKLY,
  })
  period: LeaderboardPeriod;
}

export class UserRankDto {
  @ApiProperty({
    description: "User's leaderboard entry with rank information",
    type: LeaderboardEntryDto,
    nullable: true,
  })
  entry: LeaderboardEntryDto | null;

  @ApiProperty({
    description: "Time period for this rank",
    enum: LeaderboardPeriod,
    example: LeaderboardPeriod.WEEKLY,
  })
  period: LeaderboardPeriod;

  @ApiPropertyOptional({
    description: "Category ID (for category-specific ranks)",
    example: "clxxxxxxxxxxxxxxxxx",
    nullable: true,
  })
  categoryId?: string | null;
}
