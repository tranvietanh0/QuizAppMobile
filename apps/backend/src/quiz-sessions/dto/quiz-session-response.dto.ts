import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { QuizSessionStatus, Difficulty, QuestionType } from "@prisma/client";

/**
 * Question DTO for quiz play mode (without correct answer)
 */
export class SessionQuestionDto {
  @ApiProperty({
    description: "Question ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  id: string;

  @ApiProperty({
    description: "The question text",
    example: "What is the capital of France?",
  })
  content: string;

  @ApiProperty({
    description: "Type of question",
    enum: QuestionType,
    example: QuestionType.MULTIPLE_CHOICE,
  })
  type: QuestionType;

  @ApiProperty({
    description: "Difficulty level",
    enum: Difficulty,
    example: Difficulty.MEDIUM,
  })
  difficulty: Difficulty;

  @ApiProperty({
    description: "Array of answer options",
    example: ["Paris", "London", "Berlin", "Madrid"],
  })
  options: string[];

  @ApiPropertyOptional({
    description: "URL to an image associated with the question",
    example: "https://example.com/france-map.jpg",
    nullable: true,
  })
  imageUrl: string | null;

  @ApiProperty({
    description: "Points awarded for correct answer",
    example: 10,
  })
  points: number;

  @ApiProperty({
    description: "Time limit in seconds",
    example: 30,
  })
  timeLimit: number;
}

/**
 * Quiz session response DTO with questions for play
 */
export class QuizSessionResponseDto {
  @ApiProperty({
    description: "Session ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  id: string;

  @ApiProperty({
    description: "User ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  userId: string;

  @ApiProperty({
    description: "Category ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  categoryId: string;

  @ApiProperty({
    description: "Category name",
    example: "Geography",
  })
  categoryName: string;

  @ApiProperty({
    description: "Session status",
    enum: QuizSessionStatus,
    example: QuizSessionStatus.IN_PROGRESS,
  })
  status: QuizSessionStatus;

  @ApiProperty({
    description: "Current score",
    example: 50,
  })
  score: number;

  @ApiProperty({
    description: "Total number of questions in the session",
    example: 10,
  })
  totalQuestions: number;

  @ApiProperty({
    description: "Number of correct answers",
    example: 5,
  })
  correctAnswers: number;

  @ApiProperty({
    description: "Current question index (0-based)",
    example: 5,
  })
  currentIndex: number;

  @ApiProperty({
    description: "Questions in the session (without correct answers)",
    type: [SessionQuestionDto],
  })
  questions: SessionQuestionDto[];

  @ApiProperty({
    description: "IDs of questions that have been answered",
    example: ["clxxxxxxxxxxxxxxxxx1", "clxxxxxxxxxxxxxxxxx2"],
  })
  answeredQuestionIds: string[];

  @ApiProperty({
    description: "Session start timestamp",
    example: "2024-01-15T10:30:00.000Z",
  })
  startedAt: Date;

  @ApiPropertyOptional({
    description: "Session completion timestamp",
    example: "2024-01-15T10:45:00.000Z",
    nullable: true,
  })
  completedAt: Date | null;
}
