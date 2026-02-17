import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsEnum, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { Difficulty } from "@prisma/client";

export class StartQuizDto {
  @ApiProperty({
    description: "Category ID for the quiz",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  @IsString()
  categoryId: string;

  @ApiPropertyOptional({
    description: "Difficulty level filter",
    enum: Difficulty,
    example: Difficulty.MEDIUM,
  })
  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @ApiPropertyOptional({
    description: "Number of questions in the quiz (default: 10, max: 50)",
    minimum: 1,
    maximum: 50,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  questionCount?: number = 10;
}
