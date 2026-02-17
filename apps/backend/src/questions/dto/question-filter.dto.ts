import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { QuestionType, Difficulty } from "@prisma/client";

export class QuestionFilterDto {
  @ApiPropertyOptional({
    description: "Filter by category ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({
    description: "Filter by question type",
    enum: QuestionType,
    example: QuestionType.MULTIPLE_CHOICE,
  })
  @IsOptional()
  @IsEnum(QuestionType, { message: "Invalid question type" })
  type?: QuestionType;

  @ApiPropertyOptional({
    description: "Filter by difficulty level",
    enum: Difficulty,
    example: Difficulty.MEDIUM,
  })
  @IsOptional()
  @IsEnum(Difficulty, { message: "Invalid difficulty level" })
  difficulty?: Difficulty;

  @ApiPropertyOptional({
    description: "Filter by active status",
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: "Search term for question content",
    example: "capital",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: "Page number (1-based)",
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: "Number of items per page",
    minimum: 1,
    maximum: 100,
    default: 20,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  get skip(): number {
    return ((this.page ?? 1) - 1) * (this.limit ?? 20);
  }

  get take(): number {
    return this.limit ?? 20;
  }
}

export class CategoryQuestionsOptionsDto {
  @ApiPropertyOptional({
    description: "Filter by difficulty level",
    enum: Difficulty,
    example: Difficulty.MEDIUM,
  })
  @IsOptional()
  @IsEnum(Difficulty, { message: "Invalid difficulty level" })
  difficulty?: Difficulty;

  @ApiPropertyOptional({
    description: "Maximum number of questions to return",
    minimum: 1,
    maximum: 100,
    default: 20,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: "Whether to return questions in random order",
    default: false,
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  random?: boolean = false;
}
