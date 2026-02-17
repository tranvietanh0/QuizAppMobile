/**
 * Theme Context for Dark/Light mode support
 * Integrates with system preferences and app store
 */
import React, { createContext, useContext, useEffect, useMemo, useCallback } from "react";
import { useColorScheme } from "react-native";

import { lightColors, darkColors, type ThemeColors } from "./colors";
import { useAppStore } from "@/stores/app.store";

/**
 * Theme preference options
 */
export type ThemePreference = "light" | "dark" | "system";

/**
 * Theme context value
 */
interface ThemeContextValue {
  /** Current color palette */
  colors: ThemeColors;
  /** Whether currently in dark mode */
  isDark: boolean;
  /** Current theme preference setting */
  preference: ThemePreference;
  /** Toggle between light and dark */
  toggleTheme: () => void;
  /** Set specific theme preference */
  setThemePreference: (preference: ThemePreference) => void;
  /** Color mode string for Gluestack */
  colorMode: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Theme Provider component
 * Wraps the app to provide theme context
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const { preferences, updatePreferences, loadPreferences } = useAppStore();

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  // Get the theme preference from app store
  const themePreference = (preferences.themePreference ?? "system") as ThemePreference;

  // Determine actual dark mode based on preference and system
  const isDark = useMemo(() => {
    if (themePreference === "system") {
      return systemColorScheme === "dark";
    }
    return themePreference === "dark";
  }, [themePreference, systemColorScheme]);

  // Get colors based on theme
  const colors = useMemo(() => {
    return isDark ? darkColors : lightColors;
  }, [isDark]);

  // Color mode for Gluestack
  const colorMode: "light" | "dark" = isDark ? "dark" : "light";

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    const newPreference: ThemePreference = isDark ? "light" : "dark";
    updatePreferences({ themePreference: newPreference, darkMode: newPreference === "dark" });
  }, [isDark, updatePreferences]);

  // Set specific preference
  const setThemePreference = useCallback(
    (preference: ThemePreference) => {
      updatePreferences({
        themePreference: preference,
        darkMode:
          preference === "dark" || (preference === "system" && systemColorScheme === "dark"),
      });
    },
    [updatePreferences, systemColorScheme]
  );

  const value = useMemo(
    () => ({
      colors,
      isDark,
      preference: themePreference,
      toggleTheme,
      setThemePreference,
      colorMode,
    }),
    [colors, isDark, themePreference, toggleTheme, setThemePreference, colorMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access theme context
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

/**
 * Hook to get just colors (for performance)
 */
export function useColors(): ThemeColors {
  const { colors } = useTheme();
  return colors;
}

/**
 * Hook to check if dark mode
 */
export function useIsDark(): boolean {
  const { isDark } = useTheme();
  return isDark;
}
