/**
 * Theme color palettes following Apple Human Interface Guidelines
 * Provides consistent colors for both light and dark modes
 */

export const lightColors = {
  // Backgrounds
  background: "#FFFFFF",
  backgroundSecondary: "#F2F2F7", // iOS system gray 6
  backgroundTertiary: "#E5E5EA",

  // Text
  text: "#000000",
  textSecondary: "#3C3C43", // 60% opacity equivalent
  textTertiary: "#8E8E93",

  // System colors (iOS)
  primary: "#007AFF",
  success: "#34C759",
  warning: "#FF9500",
  error: "#FF3B30",

  // Cards & Surfaces
  card: "#FFFFFF",
  cardBorder: "#E5E5EA",

  // Separators
  separator: "#C6C6C8",
  separatorOpaque: "#E5E5EA",

  // Quiz specific colors
  correctAnswer: "#34C759",
  wrongAnswer: "#FF3B30",
  selectedOption: "#007AFF",

  // Accent colors
  accent: "#5856D6",
  accentSecondary: "#AF52DE",
} as const;

export const darkColors = {
  // Backgrounds
  background: "#000000",
  backgroundSecondary: "#1C1C1E",
  backgroundTertiary: "#2C2C2E",

  // Text
  text: "#FFFFFF",
  textSecondary: "#EBEBF5",
  textTertiary: "#8E8E93",

  // System colors (iOS dark)
  primary: "#0A84FF",
  success: "#30D158",
  warning: "#FF9F0A",
  error: "#FF453A",

  // Cards & Surfaces
  card: "#1C1C1E",
  cardBorder: "#38383A",

  // Separators
  separator: "#38383A",
  separatorOpaque: "#2C2C2E",

  // Quiz specific colors
  correctAnswer: "#30D158",
  wrongAnswer: "#FF453A",
  selectedOption: "#0A84FF",

  // Accent colors
  accent: "#5E5CE6",
  accentSecondary: "#BF5AF2",
} as const;

export type ThemeColors = {
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  primary: string;
  success: string;
  warning: string;
  error: string;
  card: string;
  cardBorder: string;
  separator: string;
  separatorOpaque: string;
  correctAnswer: string;
  wrongAnswer: string;
  selectedOption: string;
  accent: string;
  accentSecondary: string;
};
