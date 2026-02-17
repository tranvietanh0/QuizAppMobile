import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

export class SubmitAnswerDto {
  @ApiProperty({
    description: "Quiz session ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  @IsString()
  sessionId: string;

  @ApiProperty({
    description: "Question ID being answered",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  @IsString()
  questionId: string;

  @ApiProperty({
    description: "The selected answer",
    example: "Paris",
  })
  @IsString()
  selectedAnswer: string;

  @ApiProperty({
    description: "Time spent on the question in seconds",
    minimum: 0,
    example: 15,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  timeSpent: number;
}
