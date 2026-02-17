import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { QuizSessionStatus, Difficulty, QuestionType } from "@prisma/client";

/**
 * Answer review DTO - shows what the user answered and the correct answer
 */
export class AnswerReviewDto {
  @ApiProperty({
    description: "Question ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  questionId: string;

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

  @ApiProperty({
    description: "The user's selected answer",
    example: "Paris",
  })
  selectedAnswer: string;

  @ApiProperty({
    description: "The correct answer",
    example: "Paris",
  })
  correctAnswer: string;

  @ApiProperty({
    description: "Whether the user answered correctly",
    example: true,
  })
  isCorrect: boolean;

  @ApiPropertyOptional({
    description: "Explanation for the correct answer",
    example: "Paris has been the capital of France since 987 CE.",
    nullable: true,
  })
  explanation: string | null;

  @ApiProperty({
    description: "Points earned for this answer",
    example: 15,
  })
  pointsEarned: number;

  @ApiProperty({
    description: "Time spent on this question in seconds",
    example: 12,
  })
  timeSpent: number;
}

/**
 * Final quiz result DTO
 */
export class QuizResultDto {
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
    example: QuizSessionStatus.COMPLETED,
  })
  status: QuizSessionStatus;

  @ApiProperty({
    description: "Final score",
    example: 120,
  })
  score: number;

  @ApiProperty({
    description: "Total number of questions",
    example: 10,
  })
  totalQuestions: number;

  @ApiProperty({
    description: "Number of correct answers",
    example: 8,
  })
  correctAnswers: number;

  @ApiProperty({
    description: "Accuracy percentage (0-100)",
    example: 80,
  })
  accuracy: number;

  @ApiProperty({
    description: "Total time spent on the quiz in seconds",
    example: 180,
  })
  totalTimeSpent: number;

  @ApiProperty({
    description: "Average time per question in seconds",
    example: 18,
  })
  averageTimePerQuestion: number;

  @ApiProperty({
    description: "All answers with review information",
    type: [AnswerReviewDto],
  })
  answers: AnswerReviewDto[];

  @ApiProperty({
    description: "Session start timestamp",
    example: "2024-01-15T10:30:00.000Z",
  })
  startedAt: Date;

  @ApiProperty({
    description: "Session completion timestamp",
    example: "2024-01-15T10:45:00.000Z",
  })
  completedAt: Date;
}

/**
 * Session summary for history list (without detailed answers)
 */
export class SessionSummaryDto {
  @ApiProperty({
    description: "Session ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  id: string;

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
    example: QuizSessionStatus.COMPLETED,
  })
  status: QuizSessionStatus;

  @ApiProperty({
    description: "Final score",
    example: 120,
  })
  score: number;

  @ApiProperty({
    description: "Total number of questions",
    example: 10,
  })
  totalQuestions: number;

  @ApiProperty({
    description: "Number of correct answers",
    example: 8,
  })
  correctAnswers: number;

  @ApiProperty({
    description: "Accuracy percentage (0-100)",
    example: 80,
  })
  accuracy: number;

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

/**
 * Paginated sessions response
 */
export class PaginatedSessionsDto {
  @ApiProperty({
    description: "Array of session summaries",
    type: [SessionSummaryDto],
  })
  data: SessionSummaryDto[];

  @ApiProperty({
    description: "Pagination metadata",
    example: {
      total: 50,
      page: 1,
      limit: 20,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: false,
    },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
