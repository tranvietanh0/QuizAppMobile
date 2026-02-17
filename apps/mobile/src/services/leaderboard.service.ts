import { useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  LeaderboardResponseNew,
  LeaderboardFilter,
  LeaderboardEntryNew,
} from "@quizapp/shared";
import { API_ENDPOINTS } from "@quizapp/shared";

import { apiClient } from "./api-client";
import { queryKeys } from "./query-client";

/**
 * Leaderboard period enum matching backend
 */
export type LeaderboardPeriod = "DAILY" | "WEEKLY" | "MONTHLY" | "ALL_TIME";

/**
 * User rank response
 */
export interface UserRankResponse {
  entry: LeaderboardEntryNew | null;
  period: LeaderboardPeriod;
  categoryId: string | null;
}

/**
 * Get global leaderboard query hook
 */
export function useGlobalLeaderboard(filter?: LeaderboardFilter) {
  const period = filter?.period || "ALL_TIME";

  return useQuery({
    queryKey: queryKeys.leaderboard.global(period),
    queryFn: async () => {
      const response = await apiClient.get<LeaderboardResponseNew>(
        API_ENDPOINTS.LEADERBOARD.GLOBAL,
        { params: filter }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get category-specific leaderboard query hook
 */
export function useCategoryLeaderboard(categoryId: string, filter?: LeaderboardFilter) {
  const period = filter?.period || "ALL_TIME";

  return useQuery({
    queryKey: queryKeys.leaderboard.category(categoryId, period),
    queryFn: async () => {
      const endpoint = API_ENDPOINTS.LEADERBOARD.CATEGORY.replace(":id", categoryId);
      const response = await apiClient.get<LeaderboardResponseNew>(endpoint, {
        params: filter,
      });
      return response.data;
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get current user's global rank query hook
 */
export function useUserRank(filter?: LeaderboardFilter) {
  return useQuery({
    queryKey: [...queryKeys.leaderboard.all, "userRank", filter?.period],
    queryFn: async () => {
      const response = await apiClient.get<UserRankResponse>(API_ENDPOINTS.LEADERBOARD.USER_RANK, {
        params: filter,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get current user's category rank query hook
 */
export function useUserCategoryRank(categoryId: string, filter?: LeaderboardFilter) {
  return useQuery({
    queryKey: [...queryKeys.leaderboard.all, "userCategoryRank", categoryId, filter?.period],
    queryFn: async () => {
      const endpoint = API_ENDPOINTS.LEADERBOARD.USER_CATEGORY_RANK.replace(":id", categoryId);
      const response = await apiClient.get<UserRankResponse>(endpoint, {
        params: filter,
      });
      return response.data;
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Prefetch leaderboard data
 */
export function usePrefetchLeaderboard() {
  const queryClient = useQueryClient();

  return {
    prefetchGlobal: (period?: string) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.leaderboard.global(period),
        queryFn: async () => {
          const response = await apiClient.get<LeaderboardResponseNew>(
            API_ENDPOINTS.LEADERBOARD.GLOBAL,
            { params: { period } }
          );
          return response.data;
        },
      });
    },
    prefetchCategory: (categoryId: string, period?: string) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.leaderboard.category(categoryId, period),
        queryFn: async () => {
          const endpoint = API_ENDPOINTS.LEADERBOARD.CATEGORY.replace(":id", categoryId);
          const response = await apiClient.get<LeaderboardResponseNew>(endpoint, {
            params: { period },
          });
          return response.data;
        },
      });
    },
  };
}
