import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useQuizSession } from "@/services";
import { useQuizStore } from "@/stores/quiz.store";
import { useColors } from "@/theme";
import {
  FadeIn,
  Card,
  AnimatedPressable,
  ProgressRing,
  CountingInteger,
  CountingPercentage,
  VerticalSeparator,
} from "@/components/ui";

export default function QuizResultScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { data: session, isLoading } = useQuizSession(sessionId || "");
  const { resetQuiz } = useQuizStore();
  const colors = useColors();

  const handlePlayAgain = () => {
    resetQuiz();
    router.replace("/(main)/(tabs)");
  };

  const handleGoHome = () => {
    resetQuiz();
    router.replace("/(main)/(tabs)");
  };

  if (isLoading || !session) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const accuracy =
    session.totalQuestions > 0
      ? Math.round((session.correctAnswers / session.totalQuestions) * 100)
      : 0;

  const getScoreColor = () => {
    if (accuracy >= 80) return colors.success;
    if (accuracy >= 50) return colors.warning;
    return colors.error;
  };

  const getScoreMessage = () => {
    if (accuracy >= 80) return "Excellent!";
    if (accuracy >= 60) return "Good job!";
    if (accuracy >= 40) return "Not bad!";
    return "Keep practicing!";
  };

  const scoreColor = getScoreColor();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header with Progress Ring */}
          <FadeIn delay={0}>
            <View style={styles.headerSection}>
              <ProgressRing
                progress={accuracy}
                size={140}
                strokeWidth={12}
                progressColor={scoreColor}
                backgroundColor={colors.backgroundSecondary}
              >
                <CountingPercentage
                  value={accuracy}
                  style={[styles.percentageText, { color: scoreColor }]}
                />
              </ProgressRing>
              <Text style={[styles.messageText, { color: colors.text }]}>{getScoreMessage()}</Text>
              <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>
                Quiz Completed
              </Text>
            </View>
          </FadeIn>

          {/* Stats Card */}
          <FadeIn delay={150}>
            <Card variant="outlined" padding="lg" radius="xl" style={styles.statsCard}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <CountingInteger
                    value={session.score}
                    style={[styles.statValue, { color: colors.primary }]}
                  />
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Points</Text>
                </View>

                <VerticalSeparator height={50} />

                <View style={styles.statItem}>
                  <CountingInteger
                    value={session.correctAnswers}
                    style={[styles.statValue, { color: colors.success }]}
                  />
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Correct</Text>
                </View>

                <VerticalSeparator height={50} />

                <View style={styles.statItem}>
                  <CountingInteger
                    value={session.totalQuestions - session.correctAnswers}
                    style={[styles.statValue, { color: colors.error }]}
                  />
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Wrong</Text>
                </View>
              </View>
            </Card>
          </FadeIn>

          {/* Category Info */}
          <FadeIn delay={250}>
            <Card variant="outlined" padding="md" radius="xl">
              <View style={styles.categoryRow}>
                <View style={[styles.categoryIcon, { backgroundColor: colors.primary + "15" }]}>
                  <Ionicons name="book" size={24} color={colors.primary} />
                </View>
                <View style={styles.categoryText}>
                  <Text style={[styles.categoryLabel, { color: colors.textSecondary }]}>
                    Category
                  </Text>
                  <Text style={[styles.categoryName, { color: colors.text }]}>
                    {session.categoryName}
                  </Text>
                </View>
                <View style={styles.categoryStats}>
                  <Text style={[styles.categoryLabel, { color: colors.textSecondary }]}>
                    Questions
                  </Text>
                  <Text style={[styles.categoryValue, { color: colors.text }]}>
                    {session.totalQuestions}
                  </Text>
                </View>
              </View>
            </Card>
          </FadeIn>

          {/* Performance Summary */}
          <FadeIn delay={350}>
            <View style={styles.summarySection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Performance Summary</Text>

              <View style={styles.summaryList}>
                <View style={[styles.summaryItem, { backgroundColor: colors.backgroundSecondary }]}>
                  <View style={styles.summaryItemLeft}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                    <Text style={[styles.summaryItemText, { color: colors.text }]}>Accuracy</Text>
                  </View>
                  <Text style={[styles.summaryItemValue, { color: colors.text }]}>{accuracy}%</Text>
                </View>

                <View style={[styles.summaryItem, { backgroundColor: colors.backgroundSecondary }]}>
                  <View style={styles.summaryItemLeft}>
                    <Ionicons name="star" size={20} color={colors.warning} />
                    <Text style={[styles.summaryItemText, { color: colors.text }]}>
                      Total Score
                    </Text>
                  </View>
                  <Text style={[styles.summaryItemValue, { color: colors.text }]}>
                    {session.score} pts
                  </Text>
                </View>

                <View style={[styles.summaryItem, { backgroundColor: colors.backgroundSecondary }]}>
                  <View style={styles.summaryItemLeft}>
                    <Ionicons name="analytics" size={20} color={colors.primary} />
                    <Text style={[styles.summaryItemText, { color: colors.text }]}>Status</Text>
                  </View>
                  <Text
                    style={[
                      styles.summaryItemValue,
                      {
                        color: session.status === "COMPLETED" ? colors.success : colors.warning,
                      },
                    ]}
                  >
                    {session.status === "COMPLETED" ? "Completed" : "Abandoned"}
                  </Text>
                </View>
              </View>
            </View>
          </FadeIn>

          {/* Action Buttons */}
          <FadeIn delay={450}>
            <View style={styles.buttonContainer}>
              <AnimatedPressable
                onPress={handlePlayAgain}
                style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              >
                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Play Again</Text>
              </AnimatedPressable>

              <AnimatedPressable
                onPress={handleGoHome}
                style={[styles.secondaryButton, { borderColor: colors.cardBorder }]}
              >
                <Ionicons name="home" size={20} color={colors.primary} />
                <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
                  Back to Home
                </Text>
              </AnimatedPressable>
            </View>
          </FadeIn>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  percentageText: {
    fontSize: 32,
    fontWeight: "700",
  },
  messageText: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    marginTop: 8,
  },
  statsCard: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryText: {
    flex: 1,
    marginLeft: 12,
  },
  categoryLabel: {
    fontSize: 13,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  categoryStats: {
    alignItems: "flex-end",
  },
  categoryValue: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  summarySection: {
    marginTop: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  summaryList: {
    gap: 8,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  summaryItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  summaryItemText: {
    fontSize: 14,
  },
  summaryItemValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
