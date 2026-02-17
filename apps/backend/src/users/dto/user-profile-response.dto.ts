import { ApiProperty } from "@nestjs/swagger";

export class UserProfileResponseDto {
  @ApiProperty({
    description: "User ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  id: string;

  @ApiProperty({
    description: "User email address",
    example: "user@example.com",
  })
  email: string;

  @ApiProperty({
    description: "Username",
    example: "john_doe",
  })
  username: string;

  @ApiProperty({
    description: "Display name",
    example: "John Doe",
    nullable: true,
  })
  displayName: string | null;

  @ApiProperty({
    description: "Avatar URL",
    example: "https://example.com/avatar.jpg",
    nullable: true,
  })
  avatarUrl: string | null;

  @ApiProperty({
    description: "Email verification status",
    example: true,
  })
  isEmailVerified: boolean;

  @ApiProperty({
    description: "Account creation date",
    example: "2024-01-15T10:30:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Last profile update date",
    example: "2024-02-10T14:45:00.000Z",
  })
  updatedAt: Date;

  @ApiProperty({
    description: "Last login date",
    example: "2024-02-17T08:00:00.000Z",
    nullable: true,
  })
  lastLoginAt: Date | null;
}
