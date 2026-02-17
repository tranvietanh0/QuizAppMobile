// User-related type definitions
// Các types liên quan đến User

import { Role } from "./admin";

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  totalQuizzes: number;
  totalCorrect: number;
  totalQuestions: number;
  averageScore: number;
  streakDays: number;
  bestStreak: number;
  rank: number | null;
}

export interface UserPreferences {
  language: string;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  notificationsEnabled: boolean;
  darkMode: boolean;
  /** Theme preference: 'light', 'dark', or 'system' */
  themePreference?: "light" | "dark" | "system";
}

export interface UserStats {
  totalQuizzes: number;
  totalCorrect: number;
  totalQuestions: number;
  averageScore: number;
  averageTimePerQuestion: number;
  categoryStats: CategoryStats[];
}

export interface CategoryStats {
  categoryId: string;
  categoryName: string;
  totalQuizzes: number;
  totalCorrect: number;
  totalQuestions: number;
  averageScore: number;
}
