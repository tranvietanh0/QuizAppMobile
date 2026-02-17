// Daily Challenge-related type definitions
// Các types liên quan đến Daily Challenge (thử thách hàng ngày)

export interface DailyChallenge {
  id: string;
  date: string; // Format: YYYY-MM-DD
  title: string;
  description: string;
  categoryId: string | null; // null = mixed categories
  categoryName: string | null;
  questionCount: number;
  difficulty: "easy" | "medium" | "hard" | "mixed";
  bonusPoints: number; // Điểm thưởng khi hoàn thành
  expiresAt: Date;
  isCompleted: boolean;
}

export interface DailyChallengeResult {
  challengeId: string;
  userId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  bonusEarned: number;
  completedAt: Date;
  rank: number | null; // Rank trong ngày
}

export interface UserStreak {
  currentStreak: number;
  bestStreak: number;
  lastPlayedDate: string | null; // Format: YYYY-MM-DD
  totalDaysPlayed: number;
}

export interface DailyChallengeLeaderboard {
  date: string;
  entries: Array<{
    rank: number;
    userId: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    score: number;
    timeSpent: number;
    isCurrentUser: boolean;
  }>;
  totalParticipants: number;
}
