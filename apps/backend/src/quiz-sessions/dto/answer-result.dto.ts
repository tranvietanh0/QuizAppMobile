import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AnswerResultDto {
  @ApiProperty({
    description: "Whether the answer was correct",
    example: true,
  })
  isCorrect: boolean;

  @ApiProperty({
    description: "The correct answer",
    example: "Paris",
  })
  correctAnswer: string;

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
    description: "Base points for the question",
    example: 10,
  })
  basePoints: number;

  @ApiProperty({
    description: "Time bonus percentage applied",
    example: 0.5,
  })
  timeBonus: number;

  @ApiProperty({
    description: "Updated total session score",
    example: 65,
  })
  totalScore: number;

  @ApiProperty({
    description: "Updated correct answer count",
    example: 6,
  })
  correctAnswersCount: number;

  @ApiProperty({
    description: "Current question index after answering",
    example: 6,
  })
  currentIndex: number;

  @ApiProperty({
    description: "Whether this was the last question",
    example: false,
  })
  isLastQuestion: boolean;
}
