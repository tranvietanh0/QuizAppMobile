import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Category,
  QuestionForClient,
  QuizSession,
  QuizResult,
  Difficulty,
} from "@quizapp/shared";
import { API_ENDPOINTS } from "@quizapp/shared";

import { apiClient, getApiErrorMessage } from "./api-client";
import { queryKeys } from "./query-client";

/**
 * Get quiz categories query hook
 */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.quiz.categories(),
    queryFn: async () => {
      const response = await apiClient.get<Category[]>(
        API_ENDPOINTS.QUIZ.CATEGORIES
      );
      return response.data;
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
      const response = await apiClient.get<Category>(
        `${API_ENDPOINTS.QUIZ.CATEGORIES}/${categoryId}`
      );
      return response.data;
    },
    enabled: !!categoryId,
  });
}

/**
 * Start quiz session mutation hook
 */
export function useStartQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      categoryId: string;
      difficulty?: Difficulty;
      questionCount?: number;
    }) => {
      const response = await apiClient.post<{
        session: QuizSession;
        questions: QuestionForClient[];
      }>(API_ENDPOINTS.QUIZ.START, params);
      return response.data;
    },
    onSuccess: (data) => {
      // Cache the session
      queryClient.setQueryData(
        queryKeys.quiz.session(data.session.id),
        data.session
      );
    },
    onError: (error) => {
      console.error("Failed to start quiz:", getApiErrorMessage(error));
    },
  });
}

/**
 * Submit answer mutation hook
 */
export function useSubmitAnswer() {
  return useMutation({
    mutationFn: async (params: {
      sessionId: string;
      questionId: string;
      answer: string;
      timeSpent: number;
    }) => {
      const response = await apiClient.post<{
        correct: boolean;
        correctAnswer: string;
      }>(API_ENDPOINTS.QUIZ.SUBMIT_ANSWER, params);
      return response.data;
    },
    onError: (error) => {
      console.error("Failed to submit answer:", getApiErrorMessage(error));
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
      const endpoint = API_ENDPOINTS.QUIZ.RESULT.replace(":id", sessionId);
      const response = await apiClient.get<QuizResult>(endpoint);
      return response.data;
    },
    enabled: !!sessionId,
  });
}

/**
 * Get quiz questions for offline use
 */
export function usePrefetchQuestions(
  categoryId: string,
  difficulty?: Difficulty
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.get<QuestionForClient[]>(
        API_ENDPOINTS.QUIZ.QUESTIONS,
        {
          params: { categoryId, difficulty },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        queryKeys.quiz.questions(categoryId, difficulty),
        data
      );
    },
  });
}

/**
 * Get cached questions query hook
 */
export function useQuestions(categoryId: string, difficulty?: Difficulty) {
  return useQuery({
    queryKey: queryKeys.quiz.questions(categoryId, difficulty),
    queryFn: async () => {
      const response = await apiClient.get<QuestionForClient[]>(
        API_ENDPOINTS.QUIZ.QUESTIONS,
        {
          params: { categoryId, difficulty },
        }
      );
      return response.data;
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
