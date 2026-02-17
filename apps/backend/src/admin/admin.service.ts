import { Injectable, Logger } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { DashboardStatsDto, CategoryStatDto, UserGrowthDto, RecentActivityDto } from "./dto";

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStatsDto> {
    this.logger.log("Fetching dashboard statistics");

    // Get all counts in parallel
    const [
      totalUsers,
      totalCategories,
      totalQuestions,
      totalQuizSessions,
      sessionsToday,
      questionsByCategory,
      userGrowth,
      recentActivity,
    ] = await Promise.all([
      this.getTotalUsers(),
      this.getTotalCategories(),
      this.getTotalQuestions(),
      this.getTotalQuizSessions(),
      this.getSessionsToday(),
      this.getQuestionsByCategory(),
      this.getUserGrowth(),
      this.getRecentActivity(),
    ]);

    return {
      totalUsers,
      totalCategories,
      totalQuestions,
      totalQuizSessions,
      sessionsToday,
      questionsByCategory,
      userGrowth,
      recentActivity,
    };
  }

  private async getTotalUsers(): Promise<number> {
    return this.prisma.user.count();
  }

  private async getTotalCategories(): Promise<number> {
    return this.prisma.category.count({
      where: { isActive: true },
    });
  }

  private async getTotalQuestions(): Promise<number> {
    return this.prisma.question.count({
      where: { isActive: true },
    });
  }

  private async getTotalQuizSessions(): Promise<number> {
    return this.prisma.quizSession.count();
  }

  private async getSessionsToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.quizSession.count({
      where: {
        startedAt: { gte: today },
      },
    });
  }

  private async getQuestionsByCategory(): Promise<CategoryStatDto[]> {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        questionCount: true,
      },
      orderBy: { questionCount: "desc" },
    });

    return categories.map((cat) => ({
      categoryId: cat.id,
      name: cat.name,
      count: cat.questionCount,
    }));
  }

  private async getUserGrowth(): Promise<UserGrowthDto[]> {
    // Get user registration counts for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const users = await this.prisma.user.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
      select: {
        createdAt: true,
      },
    });

    // Group by date
    const dateMap = new Map<string, number>();

    // Initialize all dates with 0
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      dateMap.set(dateStr, 0);
    }

    // Count users per date
    users.forEach((user) => {
      const dateStr = user.createdAt.toISOString().split("T")[0];
      dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
    });

    // Convert to array and sort by date
    const result: UserGrowthDto[] = Array.from(dateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return result;
  }

  private async getRecentActivity(): Promise<RecentActivityDto[]> {
    const activities: RecentActivityDto[] = [];

    // Get recent user registrations
    const recentUsers = await this.prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });

    recentUsers.forEach((user) => {
      activities.push({
        id: user.id,
        type: "user_registered",
        description: `New user registered: ${user.username}`,
        timestamp: user.createdAt,
      });
    });

    // Get recent quiz completions
    const recentSessions = await this.prisma.quizSession.findMany({
      take: 5,
      where: { status: "COMPLETED" },
      orderBy: { completedAt: "desc" },
      select: {
        id: true,
        user: { select: { username: true } },
        category: { select: { name: true } },
        score: true,
        completedAt: true,
      },
    });

    recentSessions.forEach((session) => {
      if (session.completedAt) {
        activities.push({
          id: session.id,
          type: "quiz_completed",
          description: `${session.user.username} completed ${session.category.name} quiz with score ${session.score}`,
          timestamp: session.completedAt,
        });
      }
    });

    // Get recent questions added
    const recentQuestions = await this.prisma.question.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        category: { select: { name: true } },
        createdAt: true,
      },
    });

    recentQuestions.forEach((question) => {
      activities.push({
        id: question.id,
        type: "question_added",
        description: `New question added to ${question.category.name}`,
        timestamp: question.createdAt,
      });
    });

    // Sort by timestamp and take top 10
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return activities.slice(0, 10);
  }
}
