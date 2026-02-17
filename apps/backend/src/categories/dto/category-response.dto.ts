import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CategoryResponseDto {
  @ApiProperty({
    description: "Category ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  id: string;

  @ApiProperty({
    description: "Category name",
    example: "Science",
  })
  name: string;

  @ApiPropertyOptional({
    description: "Category description",
    example: "Questions about physics, chemistry, biology, and more",
    nullable: true,
  })
  description: string | null;

  @ApiPropertyOptional({
    description: "URL to the category icon image",
    example: "https://example.com/icons/science.png",
    nullable: true,
  })
  iconUrl: string | null;

  @ApiProperty({
    description: "Category color in hex format",
    example: "#3B82F6",
  })
  color: string;

  @ApiProperty({
    description: "Number of questions in this category",
    example: 50,
  })
  questionCount: number;

  @ApiProperty({
    description: "Whether the category is active",
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: "Category creation timestamp",
    example: "2024-01-15T10:30:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Category last update timestamp",
    example: "2024-01-15T10:30:00.000Z",
  })
  updatedAt: Date;
}

export class CategoriesListResponseDto {
  @ApiProperty({
    description: "List of categories",
    type: [CategoryResponseDto],
  })
  categories: CategoryResponseDto[];

  @ApiProperty({
    description: "Total number of categories",
    example: 10,
  })
  total: number;
}

export class CategoryDeleteResponseDto {
  @ApiProperty({
    description: "Success message",
    example: "Category deleted successfully",
  })
  message: string;
}
