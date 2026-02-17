/**
 * Separator - iOS-style divider component
 * Adapts to theme automatically
 */
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

import { useColors } from "@/theme";

interface SeparatorProps {
  /** Orientation of the separator */
  orientation?: "horizontal" | "vertical";
  /** Whether to use opaque (darker) style */
  opaque?: boolean;
  /** Left inset (for iOS-style list separators) */
  insetLeft?: number;
  /** Right inset */
  insetRight?: number;
  /** Custom style */
  style?: ViewStyle;
}

/**
 * iOS-style separator/divider
 */
export function Separator({
  orientation = "horizontal",
  opaque = false,
  insetLeft = 0,
  insetRight = 0,
  style,
}: SeparatorProps) {
  const colors = useColors();

  const isHorizontal = orientation === "horizontal";
  const color = opaque ? colors.separatorOpaque : colors.separator;

  const separatorStyle: ViewStyle = {
    backgroundColor: color,
    ...(isHorizontal
      ? {
          height: StyleSheet.hairlineWidth,
          marginLeft: insetLeft,
          marginRight: insetRight,
        }
      : {
          width: StyleSheet.hairlineWidth,
        }),
  };

  return <View style={[separatorStyle, style]} />;
}

/**
 * Separator with standard iOS list inset
 */
export function ListSeparator({ inset = 16 }: { inset?: number }) {
  return <Separator insetLeft={inset} />;
}

/**
 * Separator with icon area inset (for list items with icons)
 */
export function ListSeparatorInset({
  iconSize = 40,
  padding = 16,
}: {
  iconSize?: number;
  padding?: number;
}) {
  return <Separator insetLeft={iconSize + padding + 12} />;
}

/**
 * Full-width separator
 */
export function FullSeparator({ opaque = false }: { opaque?: boolean }) {
  return <Separator opaque={opaque} />;
}

/**
 * Vertical separator (for HStack dividers)
 */
export function VerticalSeparator({ height = "100%" }: { height?: number | string }) {
  const colors = useColors();

  return (
    <View
      style={{
        width: StyleSheet.hairlineWidth,
        height: height as number | "auto" | `${number}%`,
        backgroundColor: colors.separator,
      }}
    />
  );
}

export default Separator;
