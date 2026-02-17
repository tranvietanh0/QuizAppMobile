import { Controller, Get, Post, Body, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

import { DailyChallengesService } from "./daily-challenges.service";
import {
  DailyChallengeWithStatusDto,
  StartAttemptResponseDto,
  CompleteAttemptDto,
  DailyChallengeResultDto,
  UserStreakDto,
  DailyChallengeStatusDto,
} from "./dto";
import { Public, CurrentUser } from "../common/decorators";

@ApiTags("Daily Challenge")
@Controller("daily-challenge")
export class DailyChallengesController {
  constructor(private readonly dailyChallengesService: DailyChallengesService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: "Get today's daily challenge",
    description:
      "Retrieve today's daily challenge information. If authenticated, also returns the user's completion status.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Daily challenge retrieved successfully",
    type: DailyChallengeWithStatusDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "No categories available for daily challenge",
  })
  async getTodayChallenge(
    @CurrentUser("id") userId?: string
  ): Promise<DailyChallengeWithStatusDto> {
    return this.dailyChallengesService.getTodayChallenge(userId);
  }

  @Get("status")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get user's daily challenge status",
    description:
      "Check if the authenticated user has completed today's daily challenge and get their streak information.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Status retrieved successfully",
    type: DailyChallengeStatusDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Authentication required",
  })
  async getDailyChallengeStatus(
    @CurrentUser("id") userId: string
  ): Promise<DailyChallengeStatusDto> {
    return this.dailyChallengesService.getDailyChallengeStatus(userId);
  }

  @Post("start")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Start daily challenge attempt",
    description:
      "Start an attempt for today's daily challenge. Returns the questions without correct answers. If an attempt already exists but is not completed, returns the existing attempt.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Attempt started successfully",
    type: StartAttemptResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "User has already completed today's challenge",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Today's daily challenge not found",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Authentication required",
  })
  async startAttempt(@CurrentUser("id") userId: string): Promise<StartAttemptResponseDto> {
    return this.dailyChallengesService.startAttempt(userId);
  }

  @Post("complete")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Complete daily challenge attempt",
    description:
      "Submit answers and complete the daily challenge attempt. Returns the score, streak information, and detailed answer results.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Attempt completed successfully",
    type: DailyChallengeResultDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Attempt not found",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid request or not user's own attempt",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Attempt already completed",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Authentication required",
  })
  async completeAttempt(
    @CurrentUser("id") userId: string,
    @Body() completeAttemptDto: CompleteAttemptDto
  ): Promise<DailyChallengeResultDto> {
    return this.dailyChallengesService.completeAttempt(userId, completeAttemptDto);
  }

  @Get("streak")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get user's streak information",
    description:
      "Retrieve the authenticated user's daily challenge streak information, including current streak, longest streak, and bonus multiplier.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Streak information retrieved successfully",
    type: UserStreakDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Authentication required",
  })
  async getUserStreak(@CurrentUser("id") userId: string): Promise<UserStreakDto> {
    return this.dailyChallengesService.getUserStreak(userId);
  }
}
