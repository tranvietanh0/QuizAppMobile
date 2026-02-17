import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserStats, UserPreferences } from "@quizapp/shared";
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

/**
 * Get user stats query hook
 */
export function useUserStats() {
  return useQuery({
    queryKey: queryKeys.user.stats(),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<UserStats>>(API_ENDPOINTS.USER.STATS);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get user preferences query hook
 */
export function useUserPreferences() {
  return useQuery({
    queryKey: queryKeys.user.preferences(),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<UserPreferences>>(
        API_ENDPOINTS.USER.PREFERENCES
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - preferences don't change often
  });
}

/**
 * Update user preferences mutation hook
 */
export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: Partial<UserPreferences>) => {
      const response = await apiClient.patch<ApiResponse<UserPreferences>>(
        API_ENDPOINTS.USER.PREFERENCES,
        preferences
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      // Update cache with new preferences
      queryClient.setQueryData(queryKeys.user.preferences(), data);
    },
    onError: (error) => {
      console.error("Failed to update preferences:", getApiErrorMessage(error));
    },
  });
}

/**
 * Computed stats for profile display
 */
export interface ProfileStats {
  quizzes: string;
  accuracy: string;
  streak: string;
}

/**
 * Calculate profile stats from user stats
 */
export function computeProfileStats(stats: UserStats | undefined): ProfileStats {
  if (!stats) {
    return {
      quizzes: "0",
      accuracy: "0%",
      streak: "0",
    };
  }

  const accuracy =
    stats.totalQuestions > 0 ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0;

  return {
    quizzes: String(stats.totalQuizzes),
    accuracy: `${accuracy}%`,
    streak: "0", // Streak comes from daily challenge, not user stats
  };
}
