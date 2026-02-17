import { ApiProperty } from "@nestjs/swagger";

export class UserStatsResponseDto {
  @ApiProperty({
    description: "Total number of quiz games played",
    example: 42,
  })
  totalGamesPlayed: number;

  @ApiProperty({
    description: "Total score accumulated across all games",
    example: 12500,
  })
  totalScore: number;

  @ApiProperty({
    description: "Total number of correct answers",
    example: 325,
  })
  totalCorrectAnswers: number;

  @ApiProperty({
    description: "Total number of questions answered",
    example: 420,
  })
  totalQuestions: number;

  @ApiProperty({
    description: "Overall accuracy percentage",
    example: 77.38,
  })
  accuracy: number;

  @ApiProperty({
    description: "Average score per game",
    example: 297.62,
  })
  averageScore: number;

  @ApiProperty({
    description: "Highest score achieved in a single game",
    example: 500,
  })
  bestScore: number;

  @ApiProperty({
    description: "Current consecutive days playing streak",
    example: 5,
  })
  currentStreak: number;

  @ApiProperty({
    description: "Longest consecutive days playing streak",
    example: 14,
  })
  longestStreak: number;
}
