import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString, IsInt, Min, ValidateNested, ArrayMinSize } from "class-validator";
import { Type } from "class-transformer";

export class AnswerDto {
  @ApiProperty({
    description: "Question ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  @IsString()
  questionId: string;

  @ApiProperty({
    description: "Selected answer",
    example: "H2O",
  })
  @IsString()
  selectedAnswer: string;

  @ApiProperty({
    description: "Time spent on this question in seconds",
    example: 15,
  })
  @IsInt()
  @Min(0)
  timeSpent: number;
}

export class CompleteAttemptDto {
  @ApiProperty({
    description: "Attempt ID to complete",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  @IsString()
  attemptId: string;

  @ApiProperty({
    description: "Array of answers submitted by the user",
    type: [AnswerDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}
