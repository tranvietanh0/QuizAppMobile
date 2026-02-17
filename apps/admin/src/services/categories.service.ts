import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, extractData } from "./api-client";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  color: string;
  questionCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  iconUrl?: string;
  color?: string;
  isActive?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  iconUrl?: string;
  color?: string;
  isActive?: boolean;
}

interface CategoriesResponse {
  categories: Category[];
  total: number;
}

export const categoriesService = {
  async getAll(includeInactive = true): Promise<Category[]> {
    const response = await apiClient.get("/categories", {
      params: { includeInactive },
    });
    const data = extractData<CategoriesResponse>(response);
    return data.categories;
  },

  async getById(id: string): Promise<Category> {
    const response = await apiClient.get(`/categories/${id}`);
    return extractData<Category>(response);
  },

  async create(data: CreateCategoryDto): Promise<Category> {
    const response = await apiClient.post("/categories", data);
    return extractData<Category>(response);
  },

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const response = await apiClient.patch(`/categories/${id}`, data);
    return extractData<Category>(response);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  },
};

export function useCategories(includeInactive = true) {
  return useQuery({
    queryKey: ["categories", includeInactive],
    queryFn: () => categoriesService.getAll(includeInactive),
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => categoriesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryDto) => categoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      categoriesService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", variables.id] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
