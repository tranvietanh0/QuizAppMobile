/**
 * Services exports
 * Central export point for all API services and hooks
 */

// API Client
export { apiClient, getApiErrorMessage, isNetworkError } from "./api-client";
export type { ApiError } from "./api-client";

// Query Client
export { queryClient, queryKeys } from "./query-client";

// Auth Service
export {
  useLogin,
  useRegister,
  useLogout,
  useForgotPassword,
  useResetPassword,
  useCurrentUser,
  useRefreshToken,
} from "./auth.service";

// Quiz Service
export {
  useCategories,
  useCategory,
  useStartQuiz,
  useQuizSession,
  useSubmitAnswer,
  useCompleteQuiz,
  useAbandonQuiz,
  useQuizResult,
  useQuizHistory,
  usePrefetchCategories,
} from "./quiz.service";
export type {
  SessionQuestion,
  QuizSessionResponse,
  StartQuizRequest,
  SubmitAnswerRequest,
  AnswerResult,
  AnswerReview,
  QuizResult,
  SessionSummary,
  PaginatedSessions,
} from "./quiz.service";

// Leaderboard Service
export {
  useGlobalLeaderboard,
  useCategoryLeaderboard,
  useUserRank,
  useUserCategoryRank,
  usePrefetchLeaderboard,
} from "./leaderboard.service";
export type { LeaderboardPeriod, UserRankResponse } from "./leaderboard.service";

// Daily Challenge Service
export {
  useTodayChallenge,
  useDailyChallengeStatus,
  useUserStreak,
  useStartDailyChallenge,
  useCompleteDailyChallenge,
  useCanPlayToday,
  getStreakBonusInfo,
} from "./daily-challenge.service";
export type {
  DailyChallengeWithStatus,
  DailyChallengeQuestion,
  DailyChallengeAttempt,
  StartAttemptResponse,
  AnswerInput,
  CompleteAttemptRequest,
  DailyChallengeResult,
  UserStreak,
  DailyChallengeStatus,
} from "./daily-challenge.service";
