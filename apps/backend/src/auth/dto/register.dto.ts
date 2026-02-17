import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @ApiProperty({
    description: "User email address",
    example: "user@example.com",
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @ApiProperty({
    description: "Username (alphanumeric and underscore only)",
    example: "john_doe",
    minLength: 3,
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty({ message: "Username is required" })
  @MinLength(3, { message: "Username must be at least 3 characters" })
  @MaxLength(30, { message: "Username must not exceed 30 characters" })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores",
  })
  username: string;

  @ApiProperty({
    description:
      "Password (minimum 8 characters, must contain at least one uppercase, one lowercase, one number)",
    example: "Password123",
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @MaxLength(50, { message: "Password must not exceed 50 characters" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  })
  password: string;

  @ApiPropertyOptional({
    description: "Display name",
    example: "John Doe",
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: "Display name must not exceed 50 characters" })
  displayName?: string;
}
