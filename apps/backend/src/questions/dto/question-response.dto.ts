import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { QuestionType, Difficulty } from "@prisma/client";

/**
 * Full question response DTO - includes correctAnswer (for admin/review purposes)
 */
export class QuestionResponseDto {
  @ApiProperty({
    description: "Question ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  id: string;

  @ApiProperty({
    description: "Category ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  categoryId: string;

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
    description: "The correct answer",
    example: "Paris",
  })
  correctAnswer: string;

  @ApiPropertyOptional({
    description: "Explanation of the correct answer",
    example: "Paris has been the capital of France since 987 CE.",
    nullable: true,
  })
  explanation: string | null;

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

  @ApiProperty({
    description: "Whether the question is active",
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: "Creation timestamp",
    example: "2024-01-15T10:30:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Last update timestamp",
    example: "2024-01-15T10:30:00.000Z",
  })
  updatedAt: Date;
}

/**
 * Question response DTO for play mode - excludes correctAnswer and explanation
 * Used when serving questions to users during quiz gameplay
 */
export class QuestionPlayResponseDto {
  @ApiProperty({
    description: "Question ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  id: string;

  @ApiProperty({
    description: "Category ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  categoryId: string;

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
 * Paginated response for questions
 */
export class PaginatedQuestionResponseDto {
  @ApiProperty({
    description: "Array of questions",
    type: [QuestionResponseDto],
  })
  data: QuestionResponseDto[];

  @ApiProperty({
    description: "Pagination metadata",
    example: {
      total: 100,
      page: 1,
      limit: 20,
      totalPages: 5,
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

/**
 * Bulk create response
 */
export class BulkCreateResponseDto {
  @ApiProperty({
    description: "Number of questions successfully created",
    example: 10,
  })
  created: number;

  @ApiProperty({
    description: "Array of created questions",
    type: [QuestionResponseDto],
  })
  questions: QuestionResponseDto[];
}

/**
 * Delete response
 */
export class DeleteQuestionResponseDto {
  @ApiProperty({
    description: "Success message",
    example: "Question deleted successfully",
  })
  message: string;

  @ApiProperty({
    description: "ID of the deleted question",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  id: string;
}
