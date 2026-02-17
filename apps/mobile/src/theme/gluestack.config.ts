import { createConfig } from "@gluestack-ui/themed";
import { config as defaultConfig } from "@gluestack-ui/config";

/**
 * Gluestack UI custom theme configuration
 * Extends the default config with QuizApp custom colors and tokens
 */
export const config = createConfig({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    colors: {
      ...defaultConfig.tokens.colors,
      // Primary - Indigo
      primary50: "#EEF2FF",
      primary100: "#E0E7FF",
      primary200: "#C7D2FE",
      primary300: "#A5B4FC",
      primary400: "#818CF8",
      primary500: "#6366F1",
      primary600: "#4F46E5",
      primary700: "#4338CA",
      primary800: "#3730A3",
      primary900: "#312E81",

      // Secondary - Purple
      secondary50: "#FAF5FF",
      secondary100: "#F3E8FF",
      secondary200: "#E9D5FF",
      secondary300: "#D8B4FE",
      secondary400: "#C084FC",
      secondary500: "#A855F7",
      secondary600: "#9333EA",
      secondary700: "#7E22CE",
      secondary800: "#6B21A8",
      secondary900: "#581C87",

      // Success - Green
      success50: "#F0FDF4",
      success100: "#DCFCE7",
      success200: "#BBF7D0",
      success300: "#86EFAC",
      success400: "#4ADE80",
      success500: "#22C55E",
      success600: "#16A34A",
      success700: "#15803D",
      success800: "#166534",
      success900: "#14532D",

      // Error - Red
      error50: "#FEF2F2",
      error100: "#FEE2E2",
      error200: "#FECACA",
      error300: "#FCA5A5",
      error400: "#F87171",
      error500: "#EF4444",
      error600: "#DC2626",
      error700: "#B91C1C",
      error800: "#991B1B",
      error900: "#7F1D1D",

      // Warning - Amber
      warning50: "#FFFBEB",
      warning100: "#FEF3C7",
      warning200: "#FDE68A",
      warning300: "#FCD34D",
      warning400: "#FBBF24",
      warning500: "#F59E0B",
      warning600: "#D97706",
      warning700: "#B45309",
      warning800: "#92400E",
      warning900: "#78350F",

      // Text Colors
      textDark900: "#111827",
      textDark800: "#1F2937",
      textDark700: "#374151",
      textDark600: "#4B5563",
      textDark500: "#6B7280",
      textLight500: "#6B7280",
      textLight400: "#9CA3AF",
      textLight300: "#D1D5DB",
      textLight200: "#E5E7EB",
      textLight100: "#F3F4F6",

      // Background Colors
      backgroundLight50: "#F9FAFB",
      backgroundLight100: "#F3F4F6",
      backgroundLight200: "#E5E7EB",
      backgroundDark900: "#0F172A",
      backgroundDark800: "#1E293B",
      backgroundDark700: "#334155",

      // Border Colors
      borderLight200: "#E5E7EB",
      borderLight300: "#D1D5DB",
      borderDark700: "#374151",
      borderDark800: "#1F2937",
    },
    space: {
      ...defaultConfig.tokens.space,
      "0.5": 2,
      "1": 4,
      "1.5": 6,
      "2": 8,
      "2.5": 10,
      "3": 12,
      "3.5": 14,
      "4": 16,
      "5": 20,
      "6": 24,
      "7": 28,
      "8": 32,
      "9": 36,
      "10": 40,
      "12": 48,
      "14": 56,
      "16": 64,
      "20": 80,
      "24": 96,
      "28": 112,
      "32": 128,
    },
    radii: {
      ...defaultConfig.tokens.radii,
      none: 0,
      xs: 2,
      sm: 4,
      md: 6,
      lg: 8,
      xl: 12,
      "2xl": 16,
      "3xl": 24,
      full: 9999,
    },
    fontSizes: {
      ...defaultConfig.tokens.fontSizes,
      "2xs": 10,
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      "2xl": 24,
      "3xl": 30,
      "4xl": 36,
      "5xl": 48,
    },
    fontWeights: {
      ...defaultConfig.tokens.fontWeights,
      hairline: "100",
      thin: "200",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
    },
    lineHeights: {
      ...defaultConfig.tokens.lineHeights,
      xs: 16,
      sm: 20,
      md: 24,
      lg: 28,
      xl: 32,
      "2xl": 36,
      "3xl": 40,
      "4xl": 48,
      "5xl": 56,
    },
  },
});

// Export type for TypeScript support
export type AppConfig = typeof config;

declare module "@gluestack-ui/themed" {
  interface ICustomConfig extends AppConfig {}
}
