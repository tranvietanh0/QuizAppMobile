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
  useSubmitAnswer,
  useQuizResult,
  usePrefetchQuestions,
  useQuestions,
} from "./quiz.service";
