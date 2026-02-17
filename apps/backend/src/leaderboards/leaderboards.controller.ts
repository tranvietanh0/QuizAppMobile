import { Controller, Get, Param, Query, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from "@nestjs/swagger";

import { LeaderboardsService } from "./leaderboards.service";
import { LeaderboardFilterDto, LeaderboardResponseDto, UserRankDto } from "./dto";
import { Public, CurrentUser } from "../common/decorators";

interface JwtPayload {
  sub: string;
  email: string;
  username: string;
}

@ApiTags("Leaderboards")
@Controller("leaderboards")
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  @Get()
  @Public()
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get global leaderboard",
    description:
      "Retrieve the global leaderboard with optional period filtering. " +
      "If authenticated, the response will include the current user's rank.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Leaderboard retrieved successfully",
    type: LeaderboardResponseDto,
  })
  async getGlobalLeaderboard(
    @Query() filter: LeaderboardFilterDto,
    @CurrentUser() user?: JwtPayload
  ): Promise<LeaderboardResponseDto> {
    return this.leaderboardsService.getGlobalLeaderboard(filter, user?.sub);
  }

  @Get("category/:categoryId")
  @Public()
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get category-specific leaderboard",
    description:
      "Retrieve the leaderboard for a specific category with optional period filtering. " +
      "If authenticated, the response will include the current user's rank in that category.",
  })
  @ApiParam({
    name: "categoryId",
    description: "Category ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Category leaderboard retrieved successfully",
    type: LeaderboardResponseDto,
  })
  async getCategoryLeaderboard(
    @Param("categoryId") categoryId: string,
    @Query() filter: LeaderboardFilterDto,
    @CurrentUser() user?: JwtPayload
  ): Promise<LeaderboardResponseDto> {
    return this.leaderboardsService.getCategoryLeaderboard(categoryId, filter, user?.sub);
  }

  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get current user's rank",
    description: "Retrieve the current authenticated user's rank in the global leaderboard.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User rank retrieved successfully",
    type: UserRankDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Authentication required",
  })
  async getUserRank(
    @Query() filter: LeaderboardFilterDto,
    @CurrentUser() user: JwtPayload
  ): Promise<UserRankDto> {
    return this.leaderboardsService.getUserRank(user.sub, filter);
  }

  @Get("me/category/:categoryId")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get current user's rank in a category",
    description:
      "Retrieve the current authenticated user's rank in a specific category leaderboard.",
  })
  @ApiParam({
    name: "categoryId",
    description: "Category ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User category rank retrieved successfully",
    type: UserRankDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Authentication required",
  })
  async getUserCategoryRank(
    @Param("categoryId") categoryId: string,
    @Query() filter: LeaderboardFilterDto,
    @CurrentUser() user: JwtPayload
  ): Promise<UserRankDto> {
    return this.leaderboardsService.getUserCategoryRank(user.sub, categoryId, filter);
  }
}
