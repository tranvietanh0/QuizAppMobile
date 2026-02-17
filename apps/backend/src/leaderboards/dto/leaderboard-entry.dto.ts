import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class LeaderboardEntryDto {
  @ApiProperty({
    description: "User's rank in the leaderboard",
    example: 1,
  })
  rank: number;

  @ApiProperty({
    description: "User ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  userId: string;

  @ApiProperty({
    description: "Username",
    example: "johndoe",
  })
  username: string;

  @ApiPropertyOptional({
    description: "User's display name",
    example: "John Doe",
    nullable: true,
  })
  displayName: string | null;

  @ApiPropertyOptional({
    description: "URL to user's avatar",
    example: "https://example.com/avatars/johndoe.png",
    nullable: true,
  })
  avatarUrl: string | null;

  @ApiProperty({
    description: "Total score accumulated in the period",
    example: 1500,
  })
  score: number;

  @ApiProperty({
    description: "Number of games played in the period",
    example: 25,
  })
  gamesPlayed: number;

  @ApiProperty({
    description: "Accuracy percentage (correct answers / total questions * 100)",
    example: 85.5,
  })
  accuracy: number;
}
