import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Category } from "@quizapp/shared";
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

export interface SessionQuestion {
  id: string;
  content: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  options: string[];
  imageUrl: string | null;
  points: number;
  timeLimit: number;
}

export interface QuizSessionResponse {
  id: string;
  userId: string;
  categoryId: string;
  categoryName: string;
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  currentIndex: number;
  questions: SessionQuestion[];
  answeredQuestionIds: string[];
  startedAt: string;
  completedAt: string | null;
}

export interface StartQuizRequest {
  categoryId: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  questionCount?: number;
}

export interface SubmitAnswerRequest {
  sessionId: string;
  questionId: string;
  selectedAnswer: string;
  timeSpent: number;
}

export interface AnswerResult {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string | null;
  pointsEarned: number;
  basePoints: number;
  timeBonus: number;
  totalScore: number;
  correctAnswersCount: number;
  currentIndex: number;
  isLastQuestion: boolean;
}

export interface AnswerReview {
  questionId: string;
  content: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  options: string[];
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string | null;
  pointsEarned: number;
  timeSpent: number;
}

export interface QuizResult {
  id: string;
  userId: string;
  categoryId: string;
  categoryName: string;
  status: "COMPLETED" | "ABANDONED";
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  totalTimeSpent: number;
  averageTimePerQuestion: number;
  answers: AnswerReview[];
  startedAt: string;
  completedAt: string;
}

export interface SessionSummary {
  id: string;
  categoryId: string;
  categoryName: string;
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  startedAt: string;
  completedAt: string | null;
}

export interface PaginatedSessions {
  data: SessionSummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// ============================================
// Category Hooks
// ============================================

/**
 * Get quiz categories query hook
 */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.quiz.categories(),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Category[]>>(API_ENDPOINTS.QUIZ.CATEGORIES);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - categories don't change often
  });
}

/**
 * Get single category query hook
 */
export function useCategory(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.quiz.category(categoryId),
    queryFn: async () => {
      const endpoint = API_ENDPOINTS.QUIZ.CATEGORY.replace(":id", categoryId);
      const response = await apiClient.get<ApiResponse<Category>>(endpoint);
      return response.data.data;
    },
    enabled: !!categoryId,
  });
}

// ============================================
// Quiz Session Hooks
// ============================================

/**
 * Start quiz session mutation hook
 */
export function useStartQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: StartQuizRequest) => {
      const response = await apiClient.post<ApiResponse<QuizSessionResponse>>(
        API_ENDPOINTS.QUIZ.START,
        params
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      // Cache the session
      queryClient.setQueryData(queryKeys.quiz.session(data.id), data);
    },
    onError: (error) => {
      console.error("Failed to start quiz:", getApiErrorMessage(error));
    },
  });
}

/**
 * Get quiz session query hook
 */
export function useQuizSession(sessionId: string) {
  return useQuery({
    queryKey: queryKeys.quiz.session(sessionId),
    queryFn: async () => {
      const endpoint = API_ENDPOINTS.QUIZ.SESSION.replace(":id", sessionId);
      const response = await apiClient.get<ApiResponse<QuizSessionResponse>>(endpoint);
      return response.data.data;
    },
    enabled: !!sessionId,
    staleTime: 0, // Always fetch fresh data for active session
  });
}

/**
 * Submit answer mutation hook
 */
export function useSubmitAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SubmitAnswerRequest) => {
      const response = await apiClient.post<ApiResponse<AnswerResult>>(
        API_ENDPOINTS.QUIZ.SUBMIT_ANSWER,
        params
      );
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate session query to get updated state
      queryClient.invalidateQueries({
        queryKey: queryKeys.quiz.session(variables.sessionId),
      });
    },
    onError: (error) => {
      console.error("Failed to submit answer:", getApiErrorMessage(error));
    },
  });
}

/**
 * Complete quiz session mutation hook
 */
export function useCompleteQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const endpoint = API_ENDPOINTS.QUIZ.COMPLETE_SESSION.replace(":id", sessionId);
      const response = await apiClient.post<ApiResponse<QuizResult>>(endpoint);
      return response.data.data;
    },
    onSuccess: (data) => {
      // Cache the result
      queryClient.setQueryData(queryKeys.quiz.result(data.id), data);
      // Invalidate session and history
      queryClient.invalidateQueries({
        queryKey: queryKeys.quiz.session(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.quiz.all, "history"],
      });
      // Also invalidate leaderboards
      queryClient.invalidateQueries({
        queryKey: queryKeys.leaderboard.all,
      });
    },
    onError: (error) => {
      console.error("Failed to complete quiz:", getApiErrorMessage(error));
    },
  });
}

/**
 * Abandon quiz session mutation hook
 */
export function useAbandonQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const endpoint = API_ENDPOINTS.QUIZ.ABANDON_SESSION.replace(":id", sessionId);
      const response = await apiClient.post<ApiResponse<QuizResult>>(endpoint);
      return response.data.data;
    },
    onSuccess: (data) => {
      // Cache the result
      queryClient.setQueryData(queryKeys.quiz.result(data.id), data);
      // Invalidate session and history
      queryClient.invalidateQueries({
        queryKey: queryKeys.quiz.session(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.quiz.all, "history"],
      });
    },
    onError: (error) => {
      console.error("Failed to abandon quiz:", getApiErrorMessage(error));
    },
  });
}

/**
 * Get quiz result query hook
 */
export function useQuizResult(sessionId: string) {
  return useQuery({
    queryKey: queryKeys.quiz.result(sessionId),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<QuizResult>>(
        API_ENDPOINTS.QUIZ.SESSION.replace(":id", sessionId)
      );
      return response.data.data;
    },
    enabled: !!sessionId,
  });
}

/**
 * Get user's quiz history query hook
 */
export function useQuizHistory(page = 1, limit = 20) {
  return useQuery({
    queryKey: [...queryKeys.quiz.all, "history", page, limit],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<PaginatedSessions>>(
        API_ENDPOINTS.QUIZ.HISTORY,
        {
          params: { page, limit },
        }
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ============================================
// Prefetch Hooks
// ============================================

/**
 * Prefetch categories for quick loading
 */
export function usePrefetchCategories() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.quiz.categories(),
      queryFn: async () => {
        const response = await apiClient.get<ApiResponse<Category[]>>(
          API_ENDPOINTS.QUIZ.CATEGORIES
        );
        return response.data.data;
      },
    });
  };
}
