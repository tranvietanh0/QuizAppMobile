import { MMKV } from "react-native-mmkv";

/**
 * MMKV storage instance
 * Fast, synchronous storage for React Native
 * Requires development build (not compatible with Expo Go)
 */
export const storage = new MMKV();

/**
 * Storage helper functions using MMKV
 * Synchronous API for better performance
 */
export const storageHelper = {
  /**
   * Store a string value
   */
  setString: (key: string, value: string): void => {
    storage.set(key, value);
  },

  /**
   * Get a string value
   */
  getString: (key: string, defaultValue?: string): string | undefined => {
    const value = storage.getString(key);
    return value ?? defaultValue;
  },

  /**
   * Store a number value
   */
  setNumber: (key: string, value: number): void => {
    storage.set(key, value);
  },

  /**
   * Get a number value
   */
  getNumber: (key: string, defaultValue?: number): number | undefined => {
    const value = storage.getNumber(key);
    return value ?? defaultValue;
  },

  /**
   * Store a boolean value
   */
  setBoolean: (key: string, value: boolean): void => {
    storage.set(key, value);
  },

  /**
   * Get a boolean value
   */
  getBoolean: (key: string, defaultValue?: boolean): boolean | undefined => {
    const value = storage.getBoolean(key);
    return value ?? defaultValue;
  },

  /**
   * Store an object (serialized as JSON)
   */
  setObject: <T>(key: string, value: T): void => {
    storage.set(key, JSON.stringify(value));
  },

  /**
   * Get an object (parsed from JSON)
   */
  getObject: <T>(key: string, defaultValue?: T): T | undefined => {
    const value = storage.getString(key);
    if (value) {
      try {
        return JSON.parse(value) as T;
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  },

  /**
   * Delete a value
   */
  delete: (key: string): void => {
    storage.delete(key);
  },

  /**
   * Check if a key exists
   */
  contains: (key: string): boolean => {
    return storage.contains(key);
  },

  /**
   * Get all keys
   */
  getAllKeys: (): string[] => {
    return storage.getAllKeys();
  },

  /**
   * Clear all storage
   */
  clearAll: (): void => {
    storage.clearAll();
  },
};

/**
 * Storage keys constants
 * Centralized key management for type safety
 */
export const STORAGE_KEYS = {
  // Auth
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",

  // Preferences
  PREFERENCES: "preferences",
  LANGUAGE: "language",
  DARK_MODE: "darkMode",
  SOUND_ENABLED: "soundEnabled",
  VIBRATION_ENABLED: "vibrationEnabled",
  NOTIFICATIONS_ENABLED: "notificationsEnabled",

  // Offline data
  OFFLINE_QUIZZES: "offlineQuizzes",
  PENDING_SUBMISSIONS: "pendingSubmissions",
  CACHED_CATEGORIES: "cachedCategories",

  // App state
  ONBOARDING_COMPLETED: "onboardingCompleted",
  LAST_DAILY_CHALLENGE: "lastDailyChallenge",
  APP_VERSION: "appVersion",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
