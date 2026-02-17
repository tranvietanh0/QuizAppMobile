import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
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
 * Custom validator to ensure correctAnswer is included in options array
 */
@ValidatorConstraint({ name: "correctAnswerInOptions", async: false })
export class CorrectAnswerInOptionsValidator implements ValidatorConstraintInterface {
  validate(correctAnswer: string, args: ValidationArguments) {
    const object = args.object as CreateQuestionDto;
    if (!object.options || !Array.isArray(object.options)) {
      return false;
    }
    return object.options.includes(correctAnswer);
  }

  defaultMessage() {
    return "correctAnswer must be one of the values in the options array";
  }
}

export class CreateQuestionDto {
  @ApiProperty({
    description: "Category ID the question belongs to",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  @IsString()
  @IsNotEmpty({ message: "Category ID is required" })
  categoryId: string;

  @ApiProperty({
    description: "The question text",
    example: "What is the capital of France?",
    minLength: 3,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty({ message: "Question content is required" })
  @MinLength(3, { message: "Question must be at least 3 characters" })
  @MaxLength(1000, { message: "Question must not exceed 1000 characters" })
  content: string;

  @ApiPropertyOptional({
    description: "Type of question",
    enum: QuestionType,
    default: QuestionType.MULTIPLE_CHOICE,
    example: QuestionType.MULTIPLE_CHOICE,
  })
  @IsOptional()
  @IsEnum(QuestionType, { message: "Invalid question type" })
  type?: QuestionType = QuestionType.MULTIPLE_CHOICE;

  @ApiPropertyOptional({
    description: "Difficulty level of the question",
    enum: Difficulty,
    default: Difficulty.MEDIUM,
    example: Difficulty.MEDIUM,
  })
  @IsOptional()
  @IsEnum(Difficulty, { message: "Invalid difficulty level" })
  difficulty?: Difficulty = Difficulty.MEDIUM;

  @ApiProperty({
    description: "Array of answer options",
    example: ["Paris", "London", "Berlin", "Madrid"],
    minItems: 2,
    maxItems: 6,
  })
  @IsArray({ message: "Options must be an array" })
  @IsString({ each: true, message: "Each option must be a string" })
  @IsNotEmpty({ message: "Options are required" })
  options: string[];

  @ApiProperty({
    description: "The correct answer (must be one of the options)",
    example: "Paris",
  })
  @IsString()
  @IsNotEmpty({ message: "Correct answer is required" })
  @Validate(CorrectAnswerInOptionsValidator)
  correctAnswer: string;

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
    default: 10,
    example: 10,
  })
  @IsOptional()
  @IsInt({ message: "Points must be an integer" })
  @Min(1, { message: "Points must be at least 1" })
  @Max(100, { message: "Points must not exceed 100" })
  points?: number = 10;

  @ApiPropertyOptional({
    description: "Time limit in seconds to answer the question",
    minimum: 5,
    maximum: 300,
    default: 30,
    example: 30,
  })
  @IsOptional()
  @IsInt({ message: "Time limit must be an integer" })
  @Min(5, { message: "Time limit must be at least 5 seconds" })
  @Max(300, { message: "Time limit must not exceed 300 seconds" })
  timeLimit?: number = 30;
}
