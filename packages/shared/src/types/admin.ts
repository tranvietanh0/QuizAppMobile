// Admin Dashboard Types

export interface CategoryStat {
  categoryId: string;
  name: string;
  count: number;
}

export interface UserGrowth {
  date: string;
  count: number;
}

export interface RecentActivity {
  id: string;
  type: "user_registered" | "quiz_completed" | "question_added" | "category_added";
  description: string;
  timestamp: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalCategories: number;
  totalQuestions: number;
  totalQuizSessions: number;
  sessionsToday: number;
  questionsByCategory: CategoryStat[];
  userGrowth: UserGrowth[];
  recentActivity: RecentActivity[];
}

// Role enum (matches Prisma enum)
export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}
