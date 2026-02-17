import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, MaxLength, Matches, IsNotEmpty } from "class-validator";
import { Match } from "../../common/decorators/match.decorator";

export class ChangePasswordDto {
  @ApiProperty({
    description: "Current password",
    example: "OldPassword123!",
  })
  @IsString()
  @IsNotEmpty({ message: "Old password is required" })
  oldPassword: string;

  @ApiProperty({
    description:
      "New password (min 8 characters, must include uppercase, lowercase, number, and special character)",
    example: "NewPassword123!",
    minLength: 8,
    maxLength: 100,
  })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(100, { message: "Password must be at most 100 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  })
  newPassword: string;

  @ApiProperty({
    description: "Confirm new password (must match newPassword)",
    example: "NewPassword123!",
  })
  @IsString()
  @IsNotEmpty({ message: "Confirm password is required" })
  @Match("newPassword", { message: "Passwords do not match" })
  confirmPassword: string;
}
