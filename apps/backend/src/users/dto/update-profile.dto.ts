import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, MinLength, MaxLength, Matches } from "class-validator";

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: "Display name",
    example: "John Doe",
    minLength: 1,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: "Display name must be at least 1 character" })
  @MaxLength(50, { message: "Display name must be at most 50 characters" })
  displayName?: string;

  @ApiPropertyOptional({
    description: "Username (must be unique, alphanumeric with underscores)",
    example: "john_doe",
    minLength: 3,
    maxLength: 30,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: "Username must be at least 3 characters" })
  @MaxLength(30, { message: "Username must be at most 30 characters" })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores",
  })
  username?: string;
}
