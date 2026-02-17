import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User,
} from "@quizapp/shared";
import { API_ENDPOINTS } from "@quizapp/shared";

import { apiClient, getApiErrorMessage } from "./api-client";
import { queryKeys } from "./query-client";
import { useAuthStore } from "@/stores/auth.store";

/**
 * Login mutation hook
 */
export function useLogin() {
  const { setTokens, updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      updateUser(data.user as unknown as User);
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
    onError: (error) => {
      console.error("Login failed:", getApiErrorMessage(error));
    },
  });
}

/**
 * Register mutation hook
 */
export function useRegister() {
  const { setTokens, updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      updateUser(data.user as unknown as User);
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
    onError: (error) => {
      console.error("Registration failed:", getApiErrorMessage(error));
    },
  });
}

/**
 * Logout mutation hook
 */
export function useLogout() {
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    },
    onSettled: () => {
      clearAuth();
      queryClient.clear();
    },
  });
}

/**
 * Forgot password mutation hook
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
    },
    onError: (error) => {
      console.error("Forgot password failed:", getApiErrorMessage(error));
    },
  });
}

/**
 * Reset password mutation hook
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    },
    onError: (error) => {
      console.error("Reset password failed:", getApiErrorMessage(error));
    },
  });
}

/**
 * Get current user query hook
 */
export function useCurrentUser() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: async () => {
      const response = await apiClient.get<User>(API_ENDPOINTS.USER.PROFILE);
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Refresh token mutation hook
 */
export function useRefreshToken() {
  const { refreshToken, setTokens, clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<{
        accessToken: string;
        refreshToken: string;
      }>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
      return response.data;
    },
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
    },
    onError: () => {
      clearAuth();
    },
  });
}
