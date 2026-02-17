import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Difficulty } from "@prisma/client";

export class DailyChallengeDto {
  @ApiProperty({
    description: "Daily challenge ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  id: string;

  @ApiProperty({
    description: "Challenge date",
    example: "2026-02-17",
  })
  date: string;

  @ApiProperty({
    description: "Category ID for the challenge",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  categoryId: string;

  @ApiProperty({
    description: "Category name",
    example: "Science",
  })
  categoryName: string;

  @ApiPropertyOptional({
    description: "Category color",
    example: "#3B82F6",
  })
  categoryColor?: string;

  @ApiProperty({
    description: "Challenge difficulty",
    enum: Difficulty,
    example: "MEDIUM",
  })
  difficulty: Difficulty;

  @ApiProperty({
    description: "Number of questions in the challenge",
    example: 10,
  })
  questionCount: number;

  @ApiProperty({
    description: "Base reward points for completing the challenge",
    example: 100,
  })
  rewardPoints: number;

  @ApiProperty({
    description: "Challenge creation timestamp",
    example: "2026-02-17T00:00:00.000Z",
  })
  createdAt: Date;
}

export class DailyChallengeWithStatusDto extends DailyChallengeDto {
  @ApiProperty({
    description: "Whether the user has completed this challenge today",
    example: false,
  })
  completed: boolean;

  @ApiPropertyOptional({
    description: "User's score if completed",
    example: 85,
  })
  userScore?: number;

  @ApiPropertyOptional({
    description: "User's correct answers if completed",
    example: 8,
  })
  userCorrectAnswers?: number;
}
