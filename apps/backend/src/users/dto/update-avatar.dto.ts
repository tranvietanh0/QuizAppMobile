import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUrl, IsNotEmpty } from "class-validator";

export class UpdateAvatarDto {
  @ApiProperty({
    description: "URL of the new avatar image",
    example: "https://example.com/avatars/user123.jpg",
  })
  @IsString()
  @IsNotEmpty({ message: "Avatar URL is required" })
  @IsUrl({}, { message: "Avatar URL must be a valid URL" })
  avatarUrl: string;
}
