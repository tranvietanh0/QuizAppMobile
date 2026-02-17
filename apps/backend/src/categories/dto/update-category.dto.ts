import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    description: "Category name (must be unique)",
    example: "Science",
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MinLength(2, { message: "Category name must be at least 2 characters" })
  @MaxLength(50, { message: "Category name must not exceed 50 characters" })
  name?: string;

  @ApiPropertyOptional({
    description: "Category description",
    example: "Questions about physics, chemistry, biology, and more",
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500, { message: "Description must not exceed 500 characters" })
  description?: string;

  @ApiPropertyOptional({
    description: "URL to the category icon image",
    example: "https://example.com/icons/science.png",
  })
  @IsUrl({}, { message: "Icon URL must be a valid URL" })
  @IsOptional()
  iconUrl?: string;

  @ApiPropertyOptional({
    description: "Category color in hex format",
    example: "#3B82F6",
  })
  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: "Color must be a valid hex color (e.g., #3B82F6)",
  })
  color?: string;

  @ApiPropertyOptional({
    description: "Whether the category is active",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
