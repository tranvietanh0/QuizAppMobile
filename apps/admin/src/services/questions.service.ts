import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, extractData } from "./api-client";

export type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface Question {
  id: string;
  categoryId: string;
  content: string;
  type: QuestionType;
  difficulty: Difficulty;
  options: string[];
  correctAnswer: string;
  explanation: string | null;
  imageUrl: string | null;
  points: number;
  timeLimit: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface CreateQuestionDto {
  categoryId: string;
  content: string;
  type: QuestionType;
  difficulty: Difficulty;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  imageUrl?: string;
  points?: number;
  timeLimit?: number;
  isActive?: boolean;
}

export interface UpdateQuestionDto {
  categoryId?: string;
  content?: string;
  type?: QuestionType;
  difficulty?: Difficulty;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  imageUrl?: string;
  points?: number;
  timeLimit?: number;
  isActive?: boolean;
}

export interface QuestionsFilter {
  categoryId?: string;
  difficulty?: Difficulty;
  type?: QuestionType;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

interface QuestionsResponse {
  data: Question[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const questionsService = {
  async getAll(filters?: QuestionsFilter): Promise<Question[]> {
    const response = await apiClient.get("/questions", { params: filters });
    const result = extractData<QuestionsResponse>(response);
    return result.data;
  },

  async getById(id: string): Promise<Question> {
    const response = await apiClient.get(`/questions/${id}`);
    return extractData<Question>(response);
  },

  async create(data: CreateQuestionDto): Promise<Question> {
    const response = await apiClient.post("/questions", data);
    return extractData<Question>(response);
  },

  async update(id: string, data: UpdateQuestionDto): Promise<Question> {
    const response = await apiClient.patch(`/questions/${id}`, data);
    return extractData<Question>(response);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/questions/${id}`);
  },
};

export function useQuestions(filters?: QuestionsFilter) {
  return useQuery({
    queryKey: ["questions", filters],
    queryFn: () => questionsService.getAll(filters),
  });
}

export function useQuestion(id: string) {
  return useQuery({
    queryKey: ["question", id],
    queryFn: () => questionsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuestionDto) => questionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuestionDto }) =>
      questionsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["question", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => questionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
