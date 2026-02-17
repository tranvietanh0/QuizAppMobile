import { Controller, Get, Patch, Post, Delete, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

import { UsersService } from "./users.service";
import {
  UpdateProfileDto,
  UpdateAvatarDto,
  ChangePasswordDto,
  UserProfileResponseDto,
  UserStatsResponseDto,
} from "./dto";
import { CurrentUser } from "../common/decorators";
import { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

@ApiTags("Users")
@ApiBearerAuth("JWT-auth")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @ApiOperation({
    summary: "Get current user profile",
    description: "Retrieve the profile of the currently authenticated user",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User profile retrieved successfully",
    type: UserProfileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Authentication required",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found",
  })
  async getProfile(@CurrentUser() user: AuthenticatedUser): Promise<UserProfileResponseDto> {
    return this.usersService.getProfile(user.id);
  }

  @Get("me/stats")
  @ApiOperation({
    summary: "Get current user statistics",
    description:
      "Retrieve game statistics for the currently authenticated user including scores, accuracy, and streaks",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User statistics retrieved successfully",
    type: UserStatsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Authentication required",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found",
  })
  async getUserStats(@CurrentUser() user: AuthenticatedUser): Promise<UserStatsResponseDto> {
    return this.usersService.getUserStats(user.id);
  }

  @Patch("me")
  @ApiOperation({
    summary: "Update current user profile",
    description: "Update the display name and/or username of the current user",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Profile updated successfully",
    type: UserProfileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Authentication required",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Username is already taken",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Validation error",
  })
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<UserProfileResponseDto> {
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @Patch("me/avatar")
  @ApiOperation({
    summary: "Update current user avatar",
    description: "Update the avatar URL of the current user",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Avatar updated successfully",
    type: UserProfileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Authentication required",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Validation error - invalid URL",
  })
  async updateAvatar(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateAvatarDto: UpdateAvatarDto
  ): Promise<UserProfileResponseDto> {
    return this.usersService.updateAvatar(user.id, updateAvatarDto.avatarUrl);
  }

  @Post("me/change-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Change current user password",
    description:
      "Change the password of the current user. Requires the current password for verification.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Password changed successfully",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Current password is incorrect",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Validation error or cannot change password for social login accounts",
  })
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<{ message: string }> {
    await this.usersService.changePassword(
      user.id,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword
    );
    return { message: "Password changed successfully" };
  }

  @Delete("me")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Delete current user account",
    description:
      "Soft delete the current user account. User data will be anonymized but quiz history preserved.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Account deleted successfully",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Authentication required",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found",
  })
  async deleteAccount(@CurrentUser() user: AuthenticatedUser): Promise<{ message: string }> {
    await this.usersService.deleteAccount(user.id);
    return { message: "Account deleted successfully" };
  }
}
