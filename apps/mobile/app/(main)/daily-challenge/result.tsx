import { View, Text, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

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
import { useDailyChallengeStore } from "@/stores/daily-challenge.store";

export default function DailyChallengeResultScreen() {
  const { score, correctAnswers, totalQuestions, currentStreak, streakBonus, isNewRecord } =
    useLocalSearchParams<{
      score: string;
      correctAnswers: string;
      totalQuestions: string;
      currentStreak: string;
      streakBonus: string;
      isNewRecord: string;
    }>();

  const colors = useColors();
  const { resetChallenge } = useDailyChallengeStore();

  const scoreNum = parseInt(score || "0", 10);
  const correctNum = parseInt(correctAnswers || "0", 10);
  const totalNum = parseInt(totalQuestions || "10", 10);
  const streakNum = parseInt(currentStreak || "0", 10);
  const streakBonusNum = parseInt(streakBonus || "0", 10);
  const hasNewRecord = isNewRecord === "true";

  const accuracy = totalNum > 0 ? Math.round((correctNum / totalNum) * 100) : 0;

  const getScoreColor = () => {
    if (accuracy >= 80) return colors.success;
    if (accuracy >= 50) return colors.warning;
    return colors.error;
  };

  const getScoreMessage = () => {
    if (accuracy >= 80) return "Excellent!";
    if (accuracy >= 60) return "Great job!";
    if (accuracy >= 40) return "Good effort!";
    return "Keep practicing!";
  };

  const handleGoHome = () => {
    resetChallenge();
    router.replace("/(main)/(tabs)");
  };

  const scoreColor = getScoreColor();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
              Daily Challenge Complete
            </Text>
          </View>
        </FadeIn>

        {/* New Record Badge */}
        {hasNewRecord && (
          <FadeIn delay={100}>
            <View style={[styles.newRecordBadge, { backgroundColor: colors.warning + "20" }]}>
              <Ionicons name="trophy" size={20} color={colors.warning} />
              <Text style={[styles.newRecordText, { color: colors.warning }]}>New Record!</Text>
            </View>
          </FadeIn>
        )}

        {/* Stats Card */}
        <FadeIn delay={150}>
          <Card variant="outlined" padding="lg" radius="xl" style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <CountingInteger
                  value={scoreNum}
                  style={[styles.statValue, { color: colors.primary }]}
                />
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Points</Text>
              </View>

              <VerticalSeparator height={50} />

              <View style={styles.statItem}>
                <CountingInteger
                  value={correctNum}
                  style={[styles.statValue, { color: colors.success }]}
                />
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Correct</Text>
              </View>

              <VerticalSeparator height={50} />

              <View style={styles.statItem}>
                <CountingInteger
                  value={totalNum - correctNum}
                  style={[styles.statValue, { color: colors.error }]}
                />
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Wrong</Text>
              </View>
            </View>
          </Card>
        </FadeIn>

        {/* Streak Card */}
        <FadeIn delay={250}>
          <Card variant="filled" padding="lg" radius="xl" style={styles.streakCard}>
            <View style={styles.streakContent}>
              <View style={[styles.streakIcon, { backgroundColor: colors.warning + "20" }]}>
                <Ionicons name="flame" size={32} color={colors.warning} />
              </View>
              <View style={styles.streakInfo}>
                <Text style={[styles.streakValue, { color: colors.text }]}>
                  {streakNum} Day Streak
                </Text>
                {streakBonusNum > 0 && (
                  <Text style={[styles.streakBonus, { color: colors.success }]}>
                    +{streakBonusNum} bonus points
                  </Text>
                )}
              </View>
              <Ionicons name="checkmark-circle" size={28} color={colors.success} />
            </View>
          </Card>
        </FadeIn>

        {/* Encouragement */}
        <FadeIn delay={350}>
          <View style={styles.encouragementSection}>
            <Text style={[styles.encouragementText, { color: colors.textSecondary }]}>
              {accuracy >= 70
                ? "Amazing work! Keep your streak going tomorrow!"
                : "Every challenge makes you stronger. See you tomorrow!"}
            </Text>
          </View>
        </FadeIn>

        {/* Action Button */}
        <FadeIn delay={450}>
          <View style={styles.buttonContainer}>
            <AnimatedPressable
              onPress={handleGoHome}
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="home" size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Back to Home</Text>
            </AnimatedPressable>
          </View>
        </FadeIn>
      </View>
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
    flex: 1,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 24,
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
  newRecordBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 16,
  },
  newRecordText: {
    fontSize: 16,
    fontWeight: "700",
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
  streakCard: {
    marginBottom: 24,
  },
  streakContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  streakInfo: {
    flex: 1,
    marginLeft: 16,
  },
  streakValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  streakBonus: {
    fontSize: 14,
    marginTop: 2,
  },
  encouragementSection: {
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  encouragementText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: "auto",
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
});
