import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

import { storage } from "@/utils/storage";

// API Base URL - should be configured via environment variable
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api/v1";

// Debug logging for API configuration
if (__DEV__) {
  console.log("[API Client] Base URL:", API_BASE_URL);
  console.log("[API Client] ENV value:", process.env.EXPO_PUBLIC_API_URL);
}

/**
 * Create axios instance with default config
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Request interceptor - adds auth token to requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getString("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (__DEV__) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error: AxiosError) => {
    if (__DEV__) {
      console.error("[API] Request error:", error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - handles token refresh and errors
 */
apiClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`[API] Response ${response.status} from ${response.config.url}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    if (__DEV__) {
      console.error(`[API] Error ${error.response?.status || "NETWORK"}: ${error.message}`);
      if (error.response?.data) {
        console.error("[API] Error data:", JSON.stringify(error.response.data));
      }
    }
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = storage.getString("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        // Refresh token request
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        // Backend wraps response in { success, data, timestamp }
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

        // Update tokens in storage
        storage.set("accessToken", newAccessToken);
        storage.set("refreshToken", newRefreshToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear auth and redirect to login
        storage.delete("accessToken");
        storage.delete("refreshToken");
        storage.delete("user");

        // Note: Navigation should be handled by the auth store listener
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * API error type
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Extract error message from API error response
 */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError | undefined;
    if (apiError?.message) {
      return apiError.message;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    return !error.response && error.code === "ERR_NETWORK";
  }
  return false;
}

export default apiClient;
