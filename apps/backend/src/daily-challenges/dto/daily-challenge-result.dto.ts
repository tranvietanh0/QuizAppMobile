import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AnswerResultDto {
  @ApiProperty({
    description: "Question ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  questionId: string;

  @ApiProperty({
    description: "Whether the answer was correct",
    example: true,
  })
  isCorrect: boolean;

  @ApiProperty({
    description: "The correct answer",
    example: "H2O",
  })
  correctAnswer: string;

  @ApiProperty({
    description: "User's selected answer",
    example: "H2O",
  })
  selectedAnswer: string;

  @ApiProperty({
    description: "Points earned for this question",
    example: 10,
  })
  pointsEarned: number;

  @ApiPropertyOptional({
    description: "Explanation for the correct answer",
    example:
      "H2O is the molecular formula for water, consisting of two hydrogen atoms and one oxygen atom.",
  })
  explanation?: string | null;
}

export class DailyChallengeResultDto {
  @ApiProperty({
    description: "Total score earned",
    example: 85,
  })
  score: number;

  @ApiProperty({
    description: "Number of correct answers",
    example: 8,
  })
  correctAnswers: number;

  @ApiProperty({
    description: "Total number of questions",
    example: 10,
  })
  totalQuestions: number;

  @ApiProperty({
    description: "Base points before any bonuses",
    example: 80,
  })
  basePoints: number;

  @ApiProperty({
    description: "Streak bonus multiplier (1.0 = no bonus)",
    example: 1.25,
  })
  streakMultiplier: number;

  @ApiProperty({
    description: "Streak bonus points",
    example: 20,
  })
  streakBonus: number;

  @ApiProperty({
    description: "Current streak after this challenge",
    example: 7,
  })
  currentStreak: number;

  @ApiProperty({
    description: "Longest streak achieved",
    example: 14,
  })
  longestStreak: number;

  @ApiProperty({
    description: "Detailed results for each answer",
    type: [AnswerResultDto],
  })
  answerResults: AnswerResultDto[];

  @ApiProperty({
    description: "Whether this is a new longest streak",
    example: false,
  })
  isNewRecord: boolean;
}
