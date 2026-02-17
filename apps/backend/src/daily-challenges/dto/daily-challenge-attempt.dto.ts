import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { QuestionType, Difficulty } from "@prisma/client";

export class DailyChallengeAttemptDto {
  @ApiProperty({
    description: "Attempt ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  id: string;

  @ApiProperty({
    description: "Challenge ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  challengeId: string;

  @ApiProperty({
    description: "User ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  userId: string;

  @ApiProperty({
    description: "Current score",
    example: 0,
  })
  score: number;

  @ApiProperty({
    description: "Number of correct answers",
    example: 0,
  })
  correctAnswers: number;

  @ApiPropertyOptional({
    description: "Completion timestamp",
    example: "2026-02-17T10:30:00.000Z",
  })
  completedAt?: Date | null;

  @ApiProperty({
    description: "Attempt creation timestamp",
    example: "2026-02-17T10:00:00.000Z",
  })
  createdAt: Date;
}

export class DailyChallengeQuestionDto {
  @ApiProperty({
    description: "Question ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  id: string;

  @ApiProperty({
    description: "Question content",
    example: "What is the chemical symbol for water?",
  })
  content: string;

  @ApiProperty({
    description: "Question type",
    enum: QuestionType,
    example: "MULTIPLE_CHOICE",
  })
  type: QuestionType;

  @ApiProperty({
    description: "Question difficulty",
    enum: Difficulty,
    example: "MEDIUM",
  })
  difficulty: Difficulty;

  @ApiProperty({
    description: "Answer options",
    example: ["H2O", "CO2", "O2", "N2"],
    type: [String],
  })
  options: string[];

  @ApiPropertyOptional({
    description: "Image URL for the question",
    example: "https://example.com/images/question.png",
  })
  imageUrl?: string | null;

  @ApiProperty({
    description: "Points for this question",
    example: 10,
  })
  points: number;

  @ApiProperty({
    description: "Time limit in seconds",
    example: 30,
  })
  timeLimit: number;
}

export class StartAttemptResponseDto {
  @ApiProperty({
    description: "Attempt details",
    type: DailyChallengeAttemptDto,
  })
  attempt: DailyChallengeAttemptDto;

  @ApiProperty({
    description: "Questions for the daily challenge (without answers)",
    type: [DailyChallengeQuestionDto],
  })
  questions: DailyChallengeQuestionDto[];
}
