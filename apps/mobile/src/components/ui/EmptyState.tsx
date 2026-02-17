import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useColors } from "@/theme";
import { FadeIn } from "./FadeIn";
import { AnimatedPressable } from "./AnimatedPressable";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  actionText?: string;
  onAction?: () => void;
}

/**
 * Empty state component for lists and screens with no data
 * Theme-aware and animated
 */
export function EmptyState({
  title = "No data",
  message = "Nothing to display yet.",
  icon = "information-circle-outline",
  actionText,
  onAction,
}: EmptyStateProps) {
  const colors = useColors();

  return (
    <FadeIn style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.backgroundSecondary }]}>
          <Ionicons name={icon} size={32} color={colors.textTertiary} />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
        </View>

        {actionText && onAction && (
          <AnimatedPressable
            onPress={onAction}
            style={[styles.actionButton, { borderColor: colors.primary }]}
          >
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>{actionText}</Text>
          </AnimatedPressable>
        )}
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  content: {
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    marginTop: 20,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default EmptyState;
