import { Injectable, Logger } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import {
  LeaderboardFilterDto,
  LeaderboardPeriod,
  LeaderboardResponseDto,
  LeaderboardEntryDto,
  UserRankDto,
} from "./dto";

interface LeaderboardAggregateResult {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  score: bigint;
  gamesPlayed: bigint;
  correctAnswers: bigint;
  totalQuestions: bigint;
}

@Injectable()
export class LeaderboardsService {
  private readonly logger = new Logger(LeaderboardsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get the date filter based on the period
   */
  private getDateFilter(period: LeaderboardPeriod): Date | undefined {
    const now = new Date();

    switch (period) {
      case LeaderboardPeriod.DAILY:
        // Start of today (midnight)
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());

      case LeaderboardPeriod.WEEKLY: {
        // Start of this week (Sunday or Monday depending on locale, using Monday)
        const dayOfWeek = now.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysToMonday);
        return monday;
      }

      case LeaderboardPeriod.MONTHLY:
        // Start of this month
        return new Date(now.getFullYear(), now.getMonth(), 1);

      case LeaderboardPeriod.ALL_TIME:
      default:
        return undefined;
    }
  }

  /**
   * Build the base leaderboard query
   */
  private buildLeaderboardQuery(startDate: Date | undefined, categoryId?: string): string {
    const dateCondition = startDate ? `AND qs.completed_at >= '${startDate.toISOString()}'` : "";

    const categoryCondition = categoryId ? `AND qs.category_id = '${categoryId}'` : "";

    return `
      SELECT
        u.id as "userId",
        u.username,
        u.display_name as "displayName",
        u.avatar_url as "avatarUrl",
        COALESCE(SUM(qs.score), 0) as score,
        COUNT(qs.id) as "gamesPlayed",
        COALESCE(SUM(qs.correct_answers), 0) as "correctAnswers",
        COALESCE(SUM(qs.total_questions), 0) as "totalQuestions"
      FROM users u
      JOIN quiz_sessions qs ON u.id = qs.user_id
      WHERE qs.status = 'COMPLETED'
        ${dateCondition}
        ${categoryCondition}
      GROUP BY u.id, u.username, u.display_name, u.avatar_url
      HAVING COUNT(qs.id) > 0
      ORDER BY score DESC
    `;
  }

  /**
   * Convert raw query result to LeaderboardEntryDto
   */
  private toLeaderboardEntry(row: LeaderboardAggregateResult, rank: number): LeaderboardEntryDto {
    const totalQuestions = Number(row.totalQuestions);
    const correctAnswers = Number(row.correctAnswers);

    // Calculate accuracy, handling division by zero
    const accuracy =
      totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 10000) / 100 : 0;

    return {
      rank,
      userId: row.userId,
      username: row.username,
      displayName: row.displayName,
      avatarUrl: row.avatarUrl,
      score: Number(row.score),
      gamesPlayed: Number(row.gamesPlayed),
      accuracy,
    };
  }

  /**
   * Get global leaderboard
   */
  async getGlobalLeaderboard(
    filter: LeaderboardFilterDto,
    currentUserId?: string
  ): Promise<LeaderboardResponseDto> {
    const { period = LeaderboardPeriod.ALL_TIME, limit = 10, offset = 0 } = filter;
    const startDate = this.getDateFilter(period);

    this.logger.log(
      `Fetching global leaderboard: period=${period}, limit=${limit}, offset=${offset}`
    );

    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT qs.user_id) as count
      FROM quiz_sessions qs
      WHERE qs.status = 'COMPLETED'
        ${startDate ? `AND qs.completed_at >= '${startDate.toISOString()}'` : ""}
    `;

    const countResult = await this.prisma.$queryRawUnsafe<[{ count: bigint }]>(countQuery);
    const total = Number(countResult[0]?.count || 0);

    // Get leaderboard entries
    const baseQuery = this.buildLeaderboardQuery(startDate);
    const paginatedQuery = `${baseQuery} LIMIT ${limit} OFFSET ${offset}`;

    const results = await this.prisma.$queryRawUnsafe<LeaderboardAggregateResult[]>(paginatedQuery);

    // Convert to DTOs with ranks
    const entries = results.map((row, index) => this.toLeaderboardEntry(row, offset + index + 1));

    // Get current user's rank if authenticated
    let userRank: LeaderboardEntryDto | null = null;
    if (currentUserId) {
      const userRankData = await this.getUserRankInternal(currentUserId, startDate);
      userRank = userRankData;
    }

    return {
      entries,
      userRank,
      total,
      period,
    };
  }

  /**
   * Get category-specific leaderboard
   */
  async getCategoryLeaderboard(
    categoryId: string,
    filter: LeaderboardFilterDto,
    currentUserId?: string
  ): Promise<LeaderboardResponseDto> {
    const { period = LeaderboardPeriod.ALL_TIME, limit = 10, offset = 0 } = filter;
    const startDate = this.getDateFilter(period);

    this.logger.log(
      `Fetching category leaderboard: categoryId=${categoryId}, period=${period}, limit=${limit}, offset=${offset}`
    );

    // Get total count for category
    const countQuery = `
      SELECT COUNT(DISTINCT qs.user_id) as count
      FROM quiz_sessions qs
      WHERE qs.status = 'COMPLETED'
        AND qs.category_id = '${categoryId}'
        ${startDate ? `AND qs.completed_at >= '${startDate.toISOString()}'` : ""}
    `;

    const countResult = await this.prisma.$queryRawUnsafe<[{ count: bigint }]>(countQuery);
    const total = Number(countResult[0]?.count || 0);

    // Get leaderboard entries
    const baseQuery = this.buildLeaderboardQuery(startDate, categoryId);
    const paginatedQuery = `${baseQuery} LIMIT ${limit} OFFSET ${offset}`;

    const results = await this.prisma.$queryRawUnsafe<LeaderboardAggregateResult[]>(paginatedQuery);

    // Convert to DTOs with ranks
    const entries = results.map((row, index) => this.toLeaderboardEntry(row, offset + index + 1));

    // Get current user's rank if authenticated
    let userRank: LeaderboardEntryDto | null = null;
    if (currentUserId) {
      const userRankData = await this.getUserCategoryRankInternal(
        currentUserId,
        categoryId,
        startDate
      );
      userRank = userRankData;
    }

    return {
      entries,
      userRank,
      total,
      period,
    };
  }

  /**
   * Internal method to get user's rank (without category filter)
   */
  private async getUserRankInternal(
    userId: string,
    startDate: Date | undefined
  ): Promise<LeaderboardEntryDto | null> {
    const dateCondition = startDate ? `AND qs.completed_at >= '${startDate.toISOString()}'` : "";

    // First, get the user's stats
    const userStatsQuery = `
      SELECT
        u.id as "userId",
        u.username,
        u.display_name as "displayName",
        u.avatar_url as "avatarUrl",
        COALESCE(SUM(qs.score), 0) as score,
        COUNT(qs.id) as "gamesPlayed",
        COALESCE(SUM(qs.correct_answers), 0) as "correctAnswers",
        COALESCE(SUM(qs.total_questions), 0) as "totalQuestions"
      FROM users u
      LEFT JOIN quiz_sessions qs ON u.id = qs.user_id
        AND qs.status = 'COMPLETED'
        ${dateCondition}
      WHERE u.id = '${userId}'
      GROUP BY u.id, u.username, u.display_name, u.avatar_url
    `;

    const userStats =
      await this.prisma.$queryRawUnsafe<LeaderboardAggregateResult[]>(userStatsQuery);

    if (!userStats.length || Number(userStats[0].gamesPlayed) === 0) {
      return null;
    }

    const userScore = Number(userStats[0].score);

    // Get the user's rank by counting users with higher scores
    const rankQuery = `
      SELECT COUNT(DISTINCT sub.user_id) + 1 as rank
      FROM (
        SELECT
          qs.user_id,
          SUM(qs.score) as total_score
        FROM quiz_sessions qs
        WHERE qs.status = 'COMPLETED'
          ${dateCondition}
        GROUP BY qs.user_id
        HAVING SUM(qs.score) > ${userScore}
      ) sub
    `;

    const rankResult = await this.prisma.$queryRawUnsafe<[{ rank: bigint }]>(rankQuery);
    const rank = Number(rankResult[0]?.rank || 1);

    return this.toLeaderboardEntry(userStats[0], rank);
  }

  /**
   * Internal method to get user's rank in a category
   */
  private async getUserCategoryRankInternal(
    userId: string,
    categoryId: string,
    startDate: Date | undefined
  ): Promise<LeaderboardEntryDto | null> {
    const dateCondition = startDate ? `AND qs.completed_at >= '${startDate.toISOString()}'` : "";

    // First, get the user's stats for this category
    const userStatsQuery = `
      SELECT
        u.id as "userId",
        u.username,
        u.display_name as "displayName",
        u.avatar_url as "avatarUrl",
        COALESCE(SUM(qs.score), 0) as score,
        COUNT(qs.id) as "gamesPlayed",
        COALESCE(SUM(qs.correct_answers), 0) as "correctAnswers",
        COALESCE(SUM(qs.total_questions), 0) as "totalQuestions"
      FROM users u
      LEFT JOIN quiz_sessions qs ON u.id = qs.user_id
        AND qs.status = 'COMPLETED'
        AND qs.category_id = '${categoryId}'
        ${dateCondition}
      WHERE u.id = '${userId}'
      GROUP BY u.id, u.username, u.display_name, u.avatar_url
    `;

    const userStats =
      await this.prisma.$queryRawUnsafe<LeaderboardAggregateResult[]>(userStatsQuery);

    if (!userStats.length || Number(userStats[0].gamesPlayed) === 0) {
      return null;
    }

    const userScore = Number(userStats[0].score);

    // Get the user's rank by counting users with higher scores in this category
    const rankQuery = `
      SELECT COUNT(DISTINCT sub.user_id) + 1 as rank
      FROM (
        SELECT
          qs.user_id,
          SUM(qs.score) as total_score
        FROM quiz_sessions qs
        WHERE qs.status = 'COMPLETED'
          AND qs.category_id = '${categoryId}'
          ${dateCondition}
        GROUP BY qs.user_id
        HAVING SUM(qs.score) > ${userScore}
      ) sub
    `;

    const rankResult = await this.prisma.$queryRawUnsafe<[{ rank: bigint }]>(rankQuery);
    const rank = Number(rankResult[0]?.rank || 1);

    return this.toLeaderboardEntry(userStats[0], rank);
  }

  /**
   * Get user's rank in the global leaderboard
   */
  async getUserRank(userId: string, filter: LeaderboardFilterDto): Promise<UserRankDto> {
    const { period = LeaderboardPeriod.ALL_TIME } = filter;
    const startDate = this.getDateFilter(period);

    this.logger.log(`Fetching user rank: userId=${userId}, period=${period}`);

    const entry = await this.getUserRankInternal(userId, startDate);

    return {
      entry,
      period,
      categoryId: null,
    };
  }

  /**
   * Get user's rank in a category-specific leaderboard
   */
  async getUserCategoryRank(
    userId: string,
    categoryId: string,
    filter: LeaderboardFilterDto
  ): Promise<UserRankDto> {
    const { period = LeaderboardPeriod.ALL_TIME } = filter;
    const startDate = this.getDateFilter(period);

    this.logger.log(
      `Fetching user category rank: userId=${userId}, categoryId=${categoryId}, period=${period}`
    );

    const entry = await this.getUserCategoryRankInternal(userId, categoryId, startDate);

    return {
      entry,
      period,
      categoryId,
    };
  }
}
