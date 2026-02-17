import { ActivityIndicator, View, Text, StyleSheet } from "react-native";

import { useColors } from "@/theme";
import { FadeIn } from "./FadeIn";

interface LoadingScreenProps {
  message?: string;
}

/**
 * Full-screen loading component with theme support
 */
export function LoadingScreen({ message = "Dang tai..." }: LoadingScreenProps) {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FadeIn>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
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
  },
  content: {
    alignItems: "center",
  },
  message: {
    marginTop: 16,
    fontSize: 16,
  },
});

export default LoadingScreen;
