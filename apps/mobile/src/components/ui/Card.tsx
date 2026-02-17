/**
 * Card - Themed card component with subtle shadows
 * Adapts to light/dark mode automatically
 */
import React from "react";
import { View, ViewProps, StyleProp, ViewStyle } from "react-native";

import { useColors } from "@/theme";

interface CardProps extends ViewProps {
  /** Card variant */
  variant?: "elevated" | "outlined" | "filled";
  /** Padding size */
  padding?: "none" | "sm" | "md" | "lg";
  /** Border radius size */
  radius?: "sm" | "md" | "lg" | "xl";
  /** Custom style */
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const paddingSizes = {
  none: 0,
  sm: 12,
  md: 16,
  lg: 24,
};

const radiusSizes = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

/**
 * Themed card component with automatic dark/light mode support
 */
export function Card({
  variant = "elevated",
  padding = "md",
  radius = "lg",
  style,
  children,
  ...props
}: CardProps) {
  const colors = useColors();

  const cardStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius: radiusSizes[radius],
    padding: paddingSizes[padding],
  };

  // Variant-specific styles
  if (variant === "elevated") {
    Object.assign(cardStyle, {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    });
  } else if (variant === "outlined") {
    Object.assign(cardStyle, {
      borderWidth: 1,
      borderColor: colors.cardBorder,
    });
  } else if (variant === "filled") {
    Object.assign(cardStyle, {
      backgroundColor: colors.backgroundSecondary,
    });
  }

  return (
    <View style={[cardStyle, style]} {...props}>
      {children}
    </View>
  );
}

export default Card;
