import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Storage helper functions using AsyncStorage
 * Compatible with Expo Go (for development)
 * Can switch to MMKV in production with development build
 */
export const storageHelper = {
  /**
   * Store a string value
   */
  setString: async (key: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(key, value);
  },

  /**
   * Get a string value
   */
  getString: async (key: string, defaultValue?: string): Promise<string | undefined> => {
    const value = await AsyncStorage.getItem(key);
    return value ?? defaultValue;
  },

  /**
   * Store a number value
   */
  setNumber: async (key: string, value: number): Promise<void> => {
    await AsyncStorage.setItem(key, String(value));
  },

  /**
   * Get a number value
   */
  getNumber: async (key: string, defaultValue?: number): Promise<number | undefined> => {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      const num = parseFloat(value);
      return isNaN(num) ? defaultValue : num;
    }
    return defaultValue;
  },

  /**
   * Store a boolean value
   */
  setBoolean: async (key: string, value: boolean): Promise<void> => {
    await AsyncStorage.setItem(key, value ? "true" : "false");
  },

  /**
   * Get a boolean value
   */
  getBoolean: async (key: string, defaultValue?: boolean): Promise<boolean | undefined> => {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value === "true";
    }
    return defaultValue;
  },

  /**
   * Store an object (serialized as JSON)
   */
  setObject: async <T>(key: string, value: T): Promise<void> => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  /**
   * Get an object (parsed from JSON)
   */
  getObject: async <T>(key: string, defaultValue?: T): Promise<T | undefined> => {
    const value = await AsyncStorage.getItem(key);
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
  delete: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },

  /**
   * Check if a key exists
   */
  contains: async (key: string): Promise<boolean> => {
    const value = await AsyncStorage.getItem(key);
    return value !== null;
  },

  /**
   * Get all keys
   */
  getAllKeys: async (): Promise<string[]> => {
    const keys = await AsyncStorage.getAllKeys();
    return [...keys];
  },

  /**
   * Clear all storage
   */
  clearAll: async (): Promise<void> => {
    await AsyncStorage.clear();
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
