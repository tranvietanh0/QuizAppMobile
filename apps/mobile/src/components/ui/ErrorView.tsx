import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useColors } from "@/theme";
import { FadeIn } from "./FadeIn";
import { AnimatedPressable } from "./AnimatedPressable";

interface ErrorViewProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

/**
 * Error view component for displaying errors
 * Theme-aware and animated
 */
export function ErrorView({
  title = "Something went wrong",
  message = "Unable to load data. Please try again.",
  onRetry,
  retryText = "Retry",
}: ErrorViewProps) {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FadeIn>
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: colors.error + "15" }]}>
            <Ionicons name="alert-circle" size={40} color={colors.error} />
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
          </View>

          {onRetry && (
            <AnimatedPressable
              onPress={onRetry}
              style={[styles.retryButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.retryButtonText}>{retryText}</Text>
            </AnimatedPressable>
          )}
        </View>
      </FadeIn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  content: {
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ErrorView;
