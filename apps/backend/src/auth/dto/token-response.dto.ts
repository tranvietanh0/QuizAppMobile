import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
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
    example: false,
  })
  isEmailVerified: boolean;
}

export class TokenResponseDto {
  @ApiProperty({
    description: "Authenticated user information",
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    description: "JWT access token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  accessToken: string;

  @ApiProperty({
    description: "JWT refresh token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  refreshToken: string;

  @ApiProperty({
    description: "Access token expiration time in seconds",
    example: 900,
  })
  expiresIn: number;
}

export class LogoutResponseDto {
  @ApiProperty({
    description: "Success message",
    example: "Logged out successfully",
  })
  message: string;
}
