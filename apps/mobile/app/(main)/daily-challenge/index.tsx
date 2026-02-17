import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColors } from "@/theme";
import { FadeIn, AnimatedPressable, Card, EmptyState } from "@/components/ui";
import {
  useTodayChallenge,
  useUserStreak,
  useDailyChallengeStatus,
  useStartDailyChallenge,
  getStreakBonusInfo,
} from "@/services";
import { useDailyChallengeStore } from "@/stores/daily-challenge.store";

export default function DailyChallengeScreen() {
  const colors = useColors();

  const { data: challenge, isLoading: challengeLoading } = useTodayChallenge();
  const { data: streak, isLoading: streakLoading } = useUserStreak();
  const { data: status, isLoading: statusLoading } = useDailyChallengeStatus();
  const startChallengeMutation = useStartDailyChallenge();
  const { startChallenge: initChallenge } = useDailyChallengeStore();

  const isLoading = challengeLoading || streakLoading || statusLoading;
  const hasCompletedToday = status?.completedToday ?? false;
  const currentStreak = streak?.currentStreak ?? 0;
  const longestStreak = streak?.longestStreak ?? 0;
  const bonusInfo = getStreakBonusInfo(currentStreak);

  const handleStartChallenge = async () => {
    try {
      const result = await startChallengeMutation.mutateAsync();

      // Initialize store with challenge data
      initChallenge(result.attempt.id, result.attempt.challengeId, result.questions);

      // Navigate to play screen
      router.push({
        pathname: "/(main)/daily-challenge/play" as const,
        params: {
          attemptId: result.attempt.id,
          challengeId: result.attempt.challengeId,
        },
      } as never);
    } catch (error) {
      console.error("Failed to start daily challenge:", error);
    }
  };

  if (isLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: "Daily Challenge",
            headerBackTitle: "Back",
          }}
        />
        <SafeAreaView
          style={[styles.container, { backgroundColor: colors.background }]}
          edges={["bottom"]}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </SafeAreaView>
      </>
    );
  }

  if (!challenge) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: "Daily Challenge",
            headerBackTitle: "Back",
          }}
        />
        <SafeAreaView
          style={[styles.container, { backgroundColor: colors.background }]}
          edges={["bottom"]}
        >
          <View style={styles.content}>
            <EmptyState
              icon="calendar-outline"
              title="No Challenge Available"
              description="Check back later for today's challenge"
            />
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Daily Challenge",
          headerBackTitle: "Back",
        }}
      />
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["bottom"]}
      >
        <View style={styles.content}>
          {/* Streak Card */}
          <FadeIn delay={0}>
            <Card variant="filled" padding="lg" radius="xl" style={styles.streakCard}>
              <View style={styles.streakRow}>
                <View style={styles.streakItem}>
                  <View style={[styles.streakIcon, { backgroundColor: colors.warning + "20" }]}>
                    <Ionicons name="flame" size={28} color={colors.warning} />
                  </View>
                  <Text style={[styles.streakValue, { color: colors.text }]}>{currentStreak}</Text>
                  <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>
                    Day Streak
                  </Text>
                </View>
                <View style={styles.streakDivider} />
                <View style={styles.streakItem}>
                  <View style={[styles.streakIcon, { backgroundColor: colors.primary + "20" }]}>
                    <Ionicons name="trophy" size={28} color={colors.primary} />
                  </View>
                  <Text style={[styles.streakValue, { color: colors.text }]}>{longestStreak}</Text>
                  <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>
                    Best Streak
                  </Text>
                </View>
              </View>

              {/* Bonus Info */}
              <View style={[styles.bonusInfo, { borderTopColor: colors.separator }]}>
                <Ionicons name="sparkles" size={16} color={colors.warning} />
                <Text style={[styles.bonusText, { color: colors.textSecondary }]}>
                  {bonusInfo.description}
                </Text>
                {bonusInfo.nextTier && (
                  <Text style={[styles.bonusNextText, { color: colors.textTertiary }]}>
                    {bonusInfo.daysToNext} days to {bonusInfo.nextTier}
                  </Text>
                )}
              </View>
            </Card>
          </FadeIn>

          {/* Challenge Info Card */}
          <FadeIn delay={100}>
            <Card variant="outlined" padding="lg" radius="xl" style={styles.challengeCard}>
              <View style={styles.challengeHeader}>
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: challenge.categoryColor + "20" },
                  ]}
                >
                  <Ionicons name="book" size={20} color={challenge.categoryColor} />
                </View>
                <View style={styles.challengeInfo}>
                  <Text style={[styles.challengeCategory, { color: colors.text }]}>
                    {challenge.categoryName}
                  </Text>
                  <Text style={[styles.challengeDifficulty, { color: colors.textTertiary }]}>
                    {challenge.difficulty}
                  </Text>
                </View>
              </View>

              <View style={styles.challengeStats}>
                <View style={styles.challengeStatItem}>
                  <Ionicons name="help-circle-outline" size={20} color={colors.primary} />
                  <Text style={[styles.challengeStatText, { color: colors.text }]}>
                    {challenge.questionCount} questions
                  </Text>
                </View>
                <View style={styles.challengeStatItem}>
                  <Ionicons name="star-outline" size={20} color={colors.warning} />
                  <Text style={[styles.challengeStatText, { color: colors.text }]}>
                    {challenge.rewardPoints} points
                  </Text>
                </View>
              </View>
            </Card>
          </FadeIn>

          {/* Completed State or Start Button */}
          <FadeIn delay={200}>
            {hasCompletedToday ? (
              <Card variant="filled" padding="lg" radius="xl" style={styles.completedCard}>
                <View style={styles.completedContent}>
                  <View style={[styles.completedIcon, { backgroundColor: colors.success + "20" }]}>
                    <Ionicons name="checkmark-circle" size={40} color={colors.success} />
                  </View>
                  <Text style={[styles.completedTitle, { color: colors.text }]}>
                    Challenge Completed!
                  </Text>
                  <Text style={[styles.completedSubtitle, { color: colors.textSecondary }]}>
                    You scored {status?.score ?? 0} points
                  </Text>
                  <Text style={[styles.completedSubtitle, { color: colors.textTertiary }]}>
                    Come back tomorrow for a new challenge
                  </Text>
                </View>
              </Card>
            ) : (
              <View style={styles.buttonContainer}>
                <AnimatedPressable
                  onPress={handleStartChallenge}
                  disabled={startChallengeMutation.isPending}
                  style={[
                    styles.startButton,
                    { backgroundColor: colors.primary },
                    startChallengeMutation.isPending && styles.startButtonDisabled,
                  ]}
                >
                  {startChallengeMutation.isPending ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="play" size={24} color="#FFFFFF" />
                      <Text style={styles.startButtonText}>Start Challenge</Text>
                    </>
                  )}
                </AnimatedPressable>
              </View>
            )}
          </FadeIn>

          {/* Go Back Button */}
          <FadeIn delay={300}>
            <AnimatedPressable
              onPress={() => router.back()}
              style={[styles.backButton, { borderColor: colors.cardBorder }]}
            >
              <Text style={[styles.backButtonText, { color: colors.primary }]}>Back to Home</Text>
            </AnimatedPressable>
          </FadeIn>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flex: 1,
  },
  streakCard: {
    marginBottom: 16,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakItem: {
    flex: 1,
    alignItems: "center",
  },
  streakIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  streakValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  streakLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  streakDivider: {
    width: 1,
    height: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    marginHorizontal: 16,
  },
  bonusInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  bonusText: {
    fontSize: 13,
    fontWeight: "500",
  },
  bonusNextText: {
    fontSize: 12,
  },
  challengeCard: {
    marginBottom: 16,
  },
  challengeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  challengeInfo: {
    marginLeft: 12,
  },
  challengeCategory: {
    fontSize: 18,
    fontWeight: "600",
  },
  challengeDifficulty: {
    fontSize: 14,
    marginTop: 2,
  },
  challengeStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  challengeStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  challengeStatText: {
    fontSize: 14,
    fontWeight: "500",
  },
  completedCard: {
    marginBottom: 16,
  },
  completedContent: {
    alignItems: "center",
    paddingVertical: 16,
  },
  completedIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  completedTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  completedSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  startButtonDisabled: {
    opacity: 0.7,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  backButton: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
