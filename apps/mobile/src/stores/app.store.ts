import { create } from "zustand";
import type { UserPreferences } from "@quizapp/shared";

import { storage } from "@/utils/storage";

/**
 * App store state interface
 */
interface AppState {
  // App status
  isOnline: boolean;
  isAppReady: boolean;

  // User preferences
  preferences: UserPreferences;

  // UI state
  isDarkMode: boolean;
}

/**
 * App store actions interface
 */
interface AppActions {
  // Network status
  setOnline: (isOnline: boolean) => void;
  setAppReady: (isReady: boolean) => void;

  // Preferences
  loadPreferences: () => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  toggleDarkMode: () => void;
  toggleSound: () => void;
  toggleVibration: () => void;
  toggleNotifications: () => void;
  setLanguage: (language: string) => void;
}

type AppStore = AppState & AppActions;

// Default preferences
const defaultPreferences: UserPreferences = {
  language: "vi",
  soundEnabled: true,
  vibrationEnabled: true,
  notificationsEnabled: true,
  darkMode: false,
  themePreference: "system",
};

/**
 * App store using Zustand
 * Manages app-wide state like preferences, network status, etc.
 */
export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  isOnline: true,
  isAppReady: false,
  preferences: defaultPreferences,
  isDarkMode: false,

  /**
   * Set online status
   */
  setOnline: (isOnline: boolean) => {
    set({ isOnline });
  },

  /**
   * Set app ready status
   */
  setAppReady: (isReady: boolean) => {
    set({ isAppReady: isReady });
  },

  /**
   * Load preferences from storage
   */
  loadPreferences: () => {
    try {
      const prefsJson = storage.getString("preferences");
      if (prefsJson) {
        const prefs = JSON.parse(prefsJson) as UserPreferences;
        set({
          preferences: { ...defaultPreferences, ...prefs },
          isDarkMode: prefs.darkMode ?? false,
        });
      }
    } catch (error) {
      console.error("Failed to load preferences:", error);
    }
  },

  /**
   * Update preferences
   */
  updatePreferences: (prefs: Partial<UserPreferences>) => {
    const { preferences } = get();
    const updatedPrefs = { ...preferences, ...prefs };
    storage.set("preferences", JSON.stringify(updatedPrefs));
    set({
      preferences: updatedPrefs,
      isDarkMode: updatedPrefs.darkMode,
    });
  },

  /**
   * Toggle dark mode
   */
  toggleDarkMode: () => {
    const { preferences } = get();
    get().updatePreferences({ darkMode: !preferences.darkMode });
  },

  /**
   * Toggle sound
   */
  toggleSound: () => {
    const { preferences } = get();
    get().updatePreferences({ soundEnabled: !preferences.soundEnabled });
  },

  /**
   * Toggle vibration
   */
  toggleVibration: () => {
    const { preferences } = get();
    get().updatePreferences({ vibrationEnabled: !preferences.vibrationEnabled });
  },

  /**
   * Toggle notifications
   */
  toggleNotifications: () => {
    const { preferences } = get();
    get().updatePreferences({
      notificationsEnabled: !preferences.notificationsEnabled,
    });
  },

  /**
   * Set language
   */
  setLanguage: (language: string) => {
    get().updatePreferences({ language });
  },
}));
