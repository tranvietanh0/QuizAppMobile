import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { QuestionType, Difficulty } from "@prisma/client";

/**
 * Custom validator to ensure correctAnswer is included in options array when both are provided
 */
@ValidatorConstraint({ name: "correctAnswerInOptionsUpdate", async: false })
export class CorrectAnswerInOptionsUpdateValidator implements ValidatorConstraintInterface {
  validate(correctAnswer: string, args: ValidationArguments) {
    const object = args.object as UpdateQuestionDto;

    // If correctAnswer is not provided, skip validation
    if (!correctAnswer) {
      return true;
    }

    // If options are provided, correctAnswer must be in options
    if (object.options && Array.isArray(object.options)) {
      return object.options.includes(correctAnswer);
    }

    // If only correctAnswer is provided without options, we'll validate against existing options in service
    return true;
  }

  defaultMessage() {
    return "correctAnswer must be one of the values in the options array";
  }
}

export class UpdateQuestionDto {
  @ApiPropertyOptional({
    description: "Category ID the question belongs to",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({
    description: "The question text",
    example: "What is the capital of France?",
    minLength: 3,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: "Question must be at least 3 characters" })
  @MaxLength(1000, { message: "Question must not exceed 1000 characters" })
  content?: string;

  @ApiPropertyOptional({
    description: "Type of question",
    enum: QuestionType,
    example: QuestionType.MULTIPLE_CHOICE,
  })
  @IsOptional()
  @IsEnum(QuestionType, { message: "Invalid question type" })
  type?: QuestionType;

  @ApiPropertyOptional({
    description: "Difficulty level of the question",
    enum: Difficulty,
    example: Difficulty.MEDIUM,
  })
  @IsOptional()
  @IsEnum(Difficulty, { message: "Invalid difficulty level" })
  difficulty?: Difficulty;

  @ApiPropertyOptional({
    description: "Array of answer options",
    example: ["Paris", "London", "Berlin", "Madrid"],
    minItems: 2,
    maxItems: 6,
  })
  @IsOptional()
  @IsArray({ message: "Options must be an array" })
  @IsString({ each: true, message: "Each option must be a string" })
  options?: string[];

  @ApiPropertyOptional({
    description: "The correct answer (must be one of the options)",
    example: "Paris",
  })
  @IsOptional()
  @IsString()
  @Validate(CorrectAnswerInOptionsUpdateValidator)
  correctAnswer?: string;

  @ApiPropertyOptional({
    description: "Explanation of the correct answer",
    example: "Paris has been the capital of France since 987 CE.",
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: "Explanation must not exceed 2000 characters" })
  explanation?: string;

  @ApiPropertyOptional({
    description: "URL to an image associated with the question",
    example: "https://example.com/france-map.jpg",
  })
  @IsOptional()
  @IsUrl({}, { message: "Image URL must be a valid URL" })
  imageUrl?: string;

  @ApiPropertyOptional({
    description: "Points awarded for correct answer",
    minimum: 1,
    maximum: 100,
    example: 10,
  })
  @IsOptional()
  @IsInt({ message: "Points must be an integer" })
  @Min(1, { message: "Points must be at least 1" })
  @Max(100, { message: "Points must not exceed 100" })
  points?: number;

  @ApiPropertyOptional({
    description: "Time limit in seconds to answer the question",
    minimum: 5,
    maximum: 300,
    example: 30,
  })
  @IsOptional()
  @IsInt({ message: "Time limit must be an integer" })
  @Min(5, { message: "Time limit must be at least 5 seconds" })
  @Max(300, { message: "Time limit must not exceed 300 seconds" })
  timeLimit?: number;

  @ApiPropertyOptional({
    description: "Whether the question is active",
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: "isActive must be a boolean" })
  isActive?: boolean;
}
