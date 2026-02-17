import { create } from "zustand";
import type { User, AuthResponse } from "@quizapp/shared";

import { storage } from "@/utils/storage";
import { apiClient } from "@/services/api-client";

/**
 * Auth store state interface
 */
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
}

/**
 * Auth store actions interface
 */
interface AuthActions {
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  updateUser: (user: Partial<User>) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
};

/**
 * Auth store using Zustand
 * Manages authentication state, tokens, and user data
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  /**
   * Initialize auth state from storage
   */
  initialize: async () => {
    try {
      const accessToken = storage.getString("accessToken");
      const refreshToken = storage.getString("refreshToken");
      const userJson = storage.getString("user");

      if (accessToken && refreshToken && userJson) {
        const user = JSON.parse(userJson) as User;
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isInitialized: true,
        });

        // Optionally verify token validity
        // await get().refreshTokens();
      } else {
        set({ isInitialized: true });
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      set({ isInitialized: true });
    }
  },

  /**
   * Login with email and password
   */
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post<AuthResponse>("/auth/login", {
        email,
        password,
      });

      const { user, accessToken, refreshToken } = response.data;

      // Persist to storage
      storage.set("accessToken", accessToken);
      storage.set("refreshToken", refreshToken);
      storage.set("user", JSON.stringify(user));

      set({
        user: user as unknown as User,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  /**
   * Register new user
   */
  register: async (email: string, username: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post<AuthResponse>("/auth/register", {
        email,
        username,
        password,
      });

      const { user, accessToken, refreshToken } = response.data;

      // Persist to storage
      storage.set("accessToken", accessToken);
      storage.set("refreshToken", refreshToken);
      storage.set("user", JSON.stringify(user));

      set({
        user: user as unknown as User,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      const { refreshToken } = get();
      if (refreshToken) {
        await apiClient.post("/auth/logout", { refreshToken });
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      get().clearAuth();
    }
  },

  /**
   * Refresh access token
   */
  refreshTokens: async () => {
    const { refreshToken } = get();
    if (!refreshToken) return false;

    try {
      const response = await apiClient.post<{
        accessToken: string;
        refreshToken: string;
      }>("/auth/refresh", { refreshToken });

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        response.data;

      // Update storage
      storage.set("accessToken", newAccessToken);
      storage.set("refreshToken", newRefreshToken);

      set({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });

      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      get().clearAuth();
      return false;
    }
  },

  /**
   * Update user data
   */
  updateUser: (userData: Partial<User>) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, ...userData };
      storage.set("user", JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  },

  /**
   * Set tokens manually (used by API interceptor)
   */
  setTokens: (accessToken: string, refreshToken: string) => {
    storage.set("accessToken", accessToken);
    storage.set("refreshToken", refreshToken);
    set({ accessToken, refreshToken });
  },

  /**
   * Clear all auth data
   */
  clearAuth: () => {
    storage.delete("accessToken");
    storage.delete("refreshToken");
    storage.delete("user");
    set({
      ...initialState,
      isInitialized: true,
    });
  },
}));
