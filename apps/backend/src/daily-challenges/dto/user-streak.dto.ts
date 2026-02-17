import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserStreakDto {
  @ApiProperty({
    description: "Streak record ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  id: string;

  @ApiProperty({
    description: "User ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  userId: string;

  @ApiProperty({
    description: "Current consecutive days streak",
    example: 7,
  })
  currentStreak: number;

  @ApiProperty({
    description: "Longest streak ever achieved",
    example: 14,
  })
  longestStreak: number;

  @ApiPropertyOptional({
    description: "Last date the user completed a daily challenge",
    example: "2026-02-16",
  })
  lastPlayedDate?: string | null;

  @ApiProperty({
    description: "Current streak bonus multiplier",
    example: 1.25,
  })
  currentMultiplier: number;

  @ApiProperty({
    description: "Description of the current bonus tier",
    example: "7+ days: 25% bonus",
  })
  bonusTier: string;

  @ApiProperty({
    description: "Days until next bonus tier (0 if at max tier)",
    example: 7,
  })
  daysToNextTier: number;

  @ApiProperty({
    description: "Last update timestamp",
    example: "2026-02-17T10:30:00.000Z",
  })
  updatedAt: Date;
}

export class DailyChallengeStatusDto {
  @ApiProperty({
    description: "Whether the user has completed today's challenge",
    example: false,
  })
  completedToday: boolean;

  @ApiPropertyOptional({
    description: "User's score if completed",
    example: 85,
  })
  score?: number;

  @ApiPropertyOptional({
    description: "User's correct answers if completed",
    example: 8,
  })
  correctAnswers?: number;

  @ApiPropertyOptional({
    description: "Completion timestamp if completed",
    example: "2026-02-17T10:30:00.000Z",
  })
  completedAt?: Date;

  @ApiProperty({
    description: "User's current streak information",
    type: UserStreakDto,
  })
  streak: UserStreakDto;
}
