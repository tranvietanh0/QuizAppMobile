// Leaderboard-related type definitions
// Các types liên quan đến Leaderboard

export type LeaderboardPeriod = "daily" | "weekly" | "monthly" | "all_time";
export type LeaderboardType = "global" | "category";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  score: number;
  totalQuizzes: number;
  accuracy: number;
  isCurrentUser: boolean;
}

export interface LeaderboardResponse {
  type: LeaderboardType;
  period: LeaderboardPeriod;
  categoryId: string | null;
  categoryName: string | null;
  entries: LeaderboardEntry[];
  currentUserRank: LeaderboardEntry | null;
  totalParticipants: number;
  updatedAt: Date;
}

export interface GetLeaderboardRequest {
  type: LeaderboardType;
  period: LeaderboardPeriod;
  categoryId?: string;
  limit?: number;
  offset?: number;
}
