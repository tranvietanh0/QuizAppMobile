import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User, AuthResponse } from "@quizapp/shared";

import { apiClient } from "@/services/api-client";
import { STORAGE_KEYS } from "@/utils/storage";

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
      const [accessToken, refreshToken, userJson] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
      ]);

      if (accessToken && refreshToken && userJson) {
        const user = JSON.parse(userJson) as User;
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isInitialized: true,
        });
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
      const response = await apiClient.post<{ data: AuthResponse }>("/auth/login", {
        email,
        password,
      });

      // Backend wraps response in { success, data, timestamp }
      const { user, accessToken, refreshToken } = response.data.data;

      // Persist to storage
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
        AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
      ]);

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
      console.log("[Auth Store] Attempting registration for:", email);
      const response = await apiClient.post<{ data: AuthResponse }>("/auth/register", {
        email,
        username,
        password,
      });
      console.log("[Auth Store] Registration successful");

      // Backend wraps response in { success, data, timestamp }
      const { user, accessToken, refreshToken } = response.data.data;

      // Persist to storage
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
        AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
      ]);

      set({
        user: user as unknown as User,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("[Auth Store] Registration failed:", error);
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
        data: { accessToken: string; refreshToken: string };
      }>("/auth/refresh", { refreshToken });

      // Backend wraps response in { success, data, timestamp }
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

      // Update storage
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken),
        AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken),
      ]);

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
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  },

  /**
   * Set tokens manually (used by API interceptor)
   */
  setTokens: (accessToken: string, refreshToken: string) => {
    AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    set({ accessToken, refreshToken });
  },

  /**
   * Clear all auth data
   */
  clearAuth: () => {
    AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER,
    ]);
    set({
      ...initialState,
      isInitialized: true,
    });
  },
}));
