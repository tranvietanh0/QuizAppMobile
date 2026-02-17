import { ApiProperty } from "@nestjs/swagger";

export class CategoryStatDto {
  @ApiProperty({ description: "Category ID" })
  categoryId: string;

  @ApiProperty({ description: "Category name" })
  name: string;

  @ApiProperty({ description: "Number of questions in this category" })
  count: number;
}

export class UserGrowthDto {
  @ApiProperty({ description: "Date (YYYY-MM-DD)" })
  date: string;

  @ApiProperty({ description: "Number of users registered on this date" })
  count: number;
}

export class RecentActivityDto {
  @ApiProperty({ description: "Activity ID" })
  id: string;

  @ApiProperty({ description: "Activity type" })
  type: "user_registered" | "quiz_completed" | "question_added" | "category_added";

  @ApiProperty({ description: "Activity description" })
  description: string;

  @ApiProperty({ description: "Timestamp" })
  timestamp: Date;
}

export class DashboardStatsDto {
  @ApiProperty({ description: "Total number of users" })
  totalUsers: number;

  @ApiProperty({ description: "Total number of categories" })
  totalCategories: number;

  @ApiProperty({ description: "Total number of questions" })
  totalQuestions: number;

  @ApiProperty({ description: "Total number of quiz sessions" })
  totalQuizSessions: number;

  @ApiProperty({ description: "Number of sessions completed today" })
  sessionsToday: number;

  @ApiProperty({
    description: "Questions count by category",
    type: [CategoryStatDto],
  })
  questionsByCategory: CategoryStatDto[];

  @ApiProperty({
    description: "User registration growth over the last 30 days",
    type: [UserGrowthDto],
  })
  userGrowth: UserGrowthDto[];

  @ApiProperty({
    description: "Recent activity log",
    type: [RecentActivityDto],
  })
  recentActivity: RecentActivityDto[];
}
