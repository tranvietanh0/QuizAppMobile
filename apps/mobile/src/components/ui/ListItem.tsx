/**
 * ListItem - iOS-style list item component
 * Used for menu items, settings, and grouped lists
 */
import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AnimatedPressable } from "./AnimatedPressable";
import { useColors } from "@/theme";

interface ListItemProps {
  /** Primary text */
  title: string;
  /** Secondary text (optional) */
  subtitle?: string;
  /** Left icon name from Ionicons */
  leftIcon?: keyof typeof Ionicons.glyphMap;
  /** Left icon background color */
  leftIconBg?: string;
  /** Right text value */
  rightText?: string;
  /** Show chevron on right */
  showChevron?: boolean;
  /** Custom right element */
  rightElement?: React.ReactNode;
  /** Press handler */
  onPress?: () => void;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Variant style */
  variant?: "default" | "danger";
}

/**
 * iOS-style list item with optional icon, subtitle, and chevron
 */
export function ListItem({
  title,
  subtitle,
  leftIcon,
  leftIconBg,
  rightText,
  showChevron = true,
  rightElement,
  onPress,
  disabled = false,
  variant = "default",
}: ListItemProps) {
  const colors = useColors();

  const isDanger = variant === "danger";

  const containerStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: isDanger ? colors.error + "30" : colors.cardBorder,
    opacity: disabled ? 0.5 : 1,
  };

  if (isDanger) {
    containerStyle.backgroundColor = colors.error + "10";
  }

  const titleStyle: TextStyle = {
    fontSize: 16,
    fontWeight: "500",
    color: isDanger ? colors.error : colors.text,
  };

  const subtitleStyle: TextStyle = {
    fontSize: 14,
    color: colors.textTertiary,
    marginTop: 2,
  };

  const rightTextStyle: TextStyle = {
    fontSize: 16,
    color: colors.textSecondary,
  };

  const content = (
    <View style={styles.container}>
      {/* Left Icon */}
      {leftIcon && (
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: leftIconBg || colors.primary + "15",
            },
          ]}
        >
          <Ionicons name={leftIcon} size={20} color={leftIconBg ? "#FFFFFF" : colors.primary} />
        </View>
      )}

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={titleStyle}>{title}</Text>
        {subtitle && <Text style={subtitleStyle}>{subtitle}</Text>}
      </View>

      {/* Right Content */}
      {rightElement || (
        <View style={styles.rightContainer}>
          {rightText && <Text style={rightTextStyle}>{rightText}</Text>}
          {showChevron && onPress && (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
              style={styles.chevron}
            />
          )}
        </View>
      )}
    </View>
  );

  if (onPress && !disabled) {
    return (
      <AnimatedPressable onPress={onPress} style={containerStyle}>
        {content}
      </AnimatedPressable>
    );
  }

  return <View style={containerStyle}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  chevron: {
    marginLeft: 8,
  },
});

export default ListItem;
