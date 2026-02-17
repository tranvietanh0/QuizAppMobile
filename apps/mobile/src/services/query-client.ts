import { QueryClient } from "@tanstack/react-query";

/**
 * TanStack Query client instance
 * Configured with sensible defaults for mobile app
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time - how long data is considered fresh (5 minutes)
      staleTime: 1000 * 60 * 5,

      // Cache time - how long inactive data stays in cache (30 minutes)
      gcTime: 1000 * 60 * 30,

      // Retry configuration
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof Error && "response" in error) {
          const status = (error as { response?: { status?: number } }).response
            ?.status;
          if (status && status >= 400 && status < 500) {
            return false;
          }
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },

      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus (useful for checking new data)
      refetchOnWindowFocus: true,

      // Don't refetch when component remounts if data is fresh
      refetchOnMount: true,

      // Refetch when internet connection is restored
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,

      // Retry delay
      retryDelay: 1000,
    },
  },
});

/**
 * Query keys factory for consistent query key management
 */
export const queryKeys = {
  // Auth
  auth: {
    all: ["auth"] as const,
    user: () => [...queryKeys.auth.all, "user"] as const,
  },

  // User
  user: {
    all: ["user"] as const,
    profile: () => [...queryKeys.user.all, "profile"] as const,
    stats: () => [...queryKeys.user.all, "stats"] as const,
    preferences: () => [...queryKeys.user.all, "preferences"] as const,
  },

  // Quiz
  quiz: {
    all: ["quiz"] as const,
    categories: () => [...queryKeys.quiz.all, "categories"] as const,
    category: (id: string) => [...queryKeys.quiz.all, "category", id] as const,
    questions: (categoryId: string, difficulty?: string) =>
      [...queryKeys.quiz.all, "questions", categoryId, difficulty] as const,
    session: (id: string) => [...queryKeys.quiz.all, "session", id] as const,
    result: (sessionId: string) =>
      [...queryKeys.quiz.all, "result", sessionId] as const,
  },

  // Leaderboard
  leaderboard: {
    all: ["leaderboard"] as const,
    global: (period?: string) =>
      [...queryKeys.leaderboard.all, "global", period] as const,
    category: (categoryId: string, period?: string) =>
      [...queryKeys.leaderboard.all, "category", categoryId, period] as const,
  },

  // Achievements
  achievements: {
    all: ["achievements"] as const,
    list: () => [...queryKeys.achievements.all, "list"] as const,
    user: () => [...queryKeys.achievements.all, "user"] as const,
    progress: () => [...queryKeys.achievements.all, "progress"] as const,
  },

  // Daily Challenge
  dailyChallenge: {
    all: ["dailyChallenge"] as const,
    today: () => [...queryKeys.dailyChallenge.all, "today"] as const,
    streak: () => [...queryKeys.dailyChallenge.all, "streak"] as const,
    leaderboard: () =>
      [...queryKeys.dailyChallenge.all, "leaderboard"] as const,
  },

  // Notifications
  notifications: {
    all: ["notifications"] as const,
    list: () => [...queryKeys.notifications.all, "list"] as const,
    unreadCount: () =>
      [...queryKeys.notifications.all, "unreadCount"] as const,
  },
} as const;

export default queryClient;
