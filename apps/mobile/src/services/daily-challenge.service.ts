import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@quizapp/shared";

import { apiClient, getApiErrorMessage } from "./api-client";
import { queryKeys } from "./query-client";

/**
 * API response wrapper type (backend wraps all responses)
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

// ============================================
// Types matching backend DTOs
// ============================================

export interface DailyChallengeWithStatus {
  id: string;
  date: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  questionCount: number;
  rewardPoints: number;
  createdAt: string;
  completed: boolean;
  userScore?: number;
  userCorrectAnswers?: number;
}

export interface DailyChallengeQuestion {
  id: string;
  content: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  options: string[];
  imageUrl: string | null;
  points: number;
  timeLimit: number;
}

export interface DailyChallengeAttempt {
  id: string;
  challengeId: string;
  userId: string;
  score: number;
  correctAnswers: number;
  completedAt: string | null;
  createdAt: string;
}

export interface StartAttemptResponse {
  attempt: DailyChallengeAttempt;
  questions: DailyChallengeQuestion[];
}

export interface AnswerInput {
  questionId: string;
  selectedAnswer: string;
}

export interface CompleteAttemptRequest {
  attemptId: string;
  answers: AnswerInput[];
}

export interface AnswerResult {
  questionId: string;
  isCorrect: boolean;
  correctAnswer: string;
  selectedAnswer: string;
  pointsEarned: number;
  explanation: string | null;
}

export interface DailyChallengeResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  basePoints: number;
  streakMultiplier: number;
  streakBonus: number;
  currentStreak: number;
  longestStreak: number;
  answerResults: AnswerResult[];
  isNewRecord: boolean;
}

export interface UserStreak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string | null;
  currentMultiplier: number;
  bonusTier: string;
  daysToNextTier: number;
  updatedAt: string;
}

export interface DailyChallengeStatus {
  completedToday: boolean;
  score?: number;
  correctAnswers?: number;
  completedAt?: string;
  streak: UserStreak;
}

// ============================================
// Query Hooks
// ============================================

/**
 * Get today's daily challenge
 */
export function useTodayChallenge() {
  return useQuery({
    queryKey: queryKeys.dailyChallenge.today(),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<DailyChallengeWithStatus>>(
        API_ENDPOINTS.DAILY_CHALLENGE.TODAY
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get user's daily challenge status
 */
export function useDailyChallengeStatus() {
  return useQuery({
    queryKey: [...queryKeys.dailyChallenge.all, "status"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<DailyChallengeStatus>>(
        API_ENDPOINTS.DAILY_CHALLENGE.STATUS
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Get user's streak information
 */
export function useUserStreak() {
  return useQuery({
    queryKey: queryKeys.dailyChallenge.streak(),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<UserStreak>>(
        API_ENDPOINTS.DAILY_CHALLENGE.STREAK
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ============================================
// Mutation Hooks
// ============================================

/**
 * Start daily challenge attempt mutation
 */
export function useStartDailyChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<ApiResponse<StartAttemptResponse>>(
        API_ENDPOINTS.DAILY_CHALLENGE.START
      );
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate today's challenge status
      queryClient.invalidateQueries({
        queryKey: queryKeys.dailyChallenge.today(),
      });
    },
    onError: (error) => {
      console.error("Failed to start daily challenge:", getApiErrorMessage(error));
    },
  });
}

/**
 * Complete daily challenge attempt mutation
 */
export function useCompleteDailyChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CompleteAttemptRequest) => {
      const response = await apiClient.post<ApiResponse<DailyChallengeResult>>(
        API_ENDPOINTS.DAILY_CHALLENGE.COMPLETE,
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate all daily challenge queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.dailyChallenge.all,
      });
      // Also invalidate leaderboards since score changed
      queryClient.invalidateQueries({
        queryKey: queryKeys.leaderboard.all,
      });
    },
    onError: (error) => {
      console.error("Failed to complete daily challenge:", getApiErrorMessage(error));
    },
  });
}

// ============================================
// Helper Hooks
// ============================================

/**
 * Check if user can play today's challenge
 */
export function useCanPlayToday() {
  const { data: status, isLoading } = useDailyChallengeStatus();

  return {
    canPlay: status ? !status.completedToday : true,
    isLoading,
    hasPlayed: status?.completedToday ?? false,
    score: status?.score,
    streak: status?.streak,
  };
}

/**
 * Get streak bonus info based on current streak
 */
export function getStreakBonusInfo(streak: number) {
  if (streak >= 30) {
    return {
      multiplier: 2.0,
      description: "30+ days: 100% bonus",
      nextTier: null,
      daysToNext: 0,
    };
  }
  if (streak >= 14) {
    return {
      multiplier: 1.5,
      description: "14+ days: 50% bonus",
      nextTier: "30 days (100%)",
      daysToNext: 30 - streak,
    };
  }
  if (streak >= 7) {
    return {
      multiplier: 1.25,
      description: "7+ days: 25% bonus",
      nextTier: "14 days (50%)",
      daysToNext: 14 - streak,
    };
  }
  if (streak >= 3) {
    return {
      multiplier: 1.1,
      description: "3+ days: 10% bonus",
      nextTier: "7 days (25%)",
      daysToNext: 7 - streak,
    };
  }

  return {
    multiplier: 1.0,
    description: "No bonus",
    nextTier: "3 days (10%)",
    daysToNext: 3 - streak,
  };
}
