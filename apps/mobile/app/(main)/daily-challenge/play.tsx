import { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator, Alert, BackHandler } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  FadeIn as RNFadeIn,
  FadeInRight,
  FadeOut,
  Layout,
} from "react-native-reanimated";

import { useCompleteDailyChallenge } from "@/services";
import { useDailyChallengeStore } from "@/stores/daily-challenge.store";
import { useColors } from "@/theme";
import { timing, easing, entrance } from "@/theme/animations";
import { AnimatedPressable, FadeIn, Card } from "@/components/ui";

export default function DailyChallengePlayScreen() {
  const { attemptId } = useLocalSearchParams<{
    attemptId: string;
  }>();
  const colors = useColors();

  const {
    questions,
    currentQuestionIndex,
    selectedAnswer,
    timeRemaining,
    selectAnswer,
    nextQuestion,
    setTimeRemaining,
    decrementTime,
    isPaused,
    submitAnswer,
    getAnswers,
    resetChallenge,
  } = useDailyChallengeStore();

  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeMutation = useCompleteDailyChallenge();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animation values
  const progressWidth = useSharedValue(0);
  const timerPulse = useSharedValue(0);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const isLastQuestion = currentQuestionIndex >= questions.length - 1;

  // Redirect back if no questions loaded (shouldn't happen normally)
  useEffect(() => {
    if (questions.length === 0) {
      router.back();
    }
  }, []);

  // Update progress bar animation
  useEffect(() => {
    progressWidth.value = withTiming(progress, {
      duration: timing.normal,
      easing: easing.easeOut,
    });
  }, [progress, progressWidth]);

  // Timer pulse animation when low
  useEffect(() => {
    if (timeRemaining <= 10 && timeRemaining > 0) {
      timerPulse.value = withSequence(
        withTiming(1, { duration: 150 }),
        withTiming(0, { duration: 150 })
      );
    }
  }, [timeRemaining, timerPulse]);

  // Timer effect
  useEffect(() => {
    if (currentQuestion && !isPaused && !showResult) {
      setTimeRemaining(currentQuestion.timeLimit);

      timerRef.current = setInterval(() => {
        decrementTime();
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [currentQuestionIndex, isPaused, showResult]);

  // Handle time running out
  useEffect(() => {
    if (timeRemaining === 0 && !showResult) {
      handleSubmitAnswer();
    }
  }, [timeRemaining]);

  // Handle back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      handleQuit();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const handleSubmitAnswer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    submitAnswer();
    setShowResult(true);
  };

  const handleNextQuestion = async () => {
    setShowResult(false);
    selectAnswer("");

    if (isLastQuestion) {
      await handleCompleteChallenge();
    } else {
      nextQuestion();
    }
  };

  const handleCompleteChallenge = async () => {
    if (!attemptId) return;

    setIsSubmitting(true);
    try {
      const answers = getAnswers();
      const result = await completeMutation.mutateAsync({
        attemptId,
        answers,
      });

      router.replace({
        pathname: "/(main)/daily-challenge/result" as const,
        params: {
          score: String(result.score),
          correctAnswers: String(result.correctAnswers),
          totalQuestions: String(result.totalQuestions),
          currentStreak: String(result.currentStreak),
          streakBonus: String(result.streakBonus),
          isNewRecord: result.isNewRecord ? "true" : "false",
        },
      } as never);
    } catch (error) {
      console.error("Failed to complete challenge:", error);
      Alert.alert("Error", "Failed to submit your answers. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuit = () => {
    Alert.alert(
      "Quit Challenge",
      "Are you sure you want to quit? Your progress will be lost and this counts as today's attempt.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Quit",
          style: "destructive",
          onPress: () => {
            resetChallenge();
            router.replace("/(main)/(tabs)");
          },
        },
      ]
    );
  };

  // Animated styles
  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const timerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + timerPulse.value * 0.1 }],
  }));

  if (!currentQuestion || questions.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading questions...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const getOptionStyle = (option: string) => {
    if (!showResult) {
      const isSelected = selectedAnswer === option;
      return {
        backgroundColor: isSelected ? colors.primary + "15" : colors.card,
        borderColor: isSelected ? colors.primary : colors.cardBorder,
      };
    }

    // In daily challenge, we don't show correct answer immediately
    // Just highlight selected option
    const isSelected = selectedAnswer === option;
    return {
      backgroundColor: isSelected ? colors.primary + "15" : colors.card,
      borderColor: isSelected ? colors.primary : colors.cardBorder,
    };
  };

  const isLowTime = timeRemaining <= 10;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <AnimatedPressable onPress={handleQuit} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </AnimatedPressable>

          <View style={styles.challengeBadge}>
            <Ionicons name="flame" size={16} color={colors.warning} />
            <Text style={[styles.challengeBadgeText, { color: colors.warning }]}>
              Daily Challenge
            </Text>
          </View>

          <Animated.View style={[styles.timerContainer, timerStyle]}>
            <Ionicons
              name="time-outline"
              size={20}
              color={isLowTime ? colors.error : colors.textSecondary}
            />
            <Text style={[styles.timerText, { color: isLowTime ? colors.error : colors.text }]}>
              {timeRemaining}s
            </Text>
          </Animated.View>
        </View>

        {/* Progress */}
        <FadeIn delay={100}>
          <View style={styles.progressSection}>
            <View style={styles.progressTextRow}>
              <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: colors.backgroundSecondary }]}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  { backgroundColor: colors.warning },
                  progressBarStyle,
                ]}
              />
            </View>
          </View>
        </FadeIn>

        {/* Question */}
        <Animated.View
          key={currentQuestionIndex}
          entering={FadeInRight.duration(timing.normal)}
          exiting={FadeOut.duration(timing.fast)}
        >
          <Card variant="filled" padding="lg" radius="xl" style={styles.questionCard}>
            <Text style={[styles.questionText, { color: colors.text }]}>
              {currentQuestion.content}
            </Text>
          </Card>
        </Animated.View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const style = getOptionStyle(option);
            const optionLetter = String.fromCharCode(65 + index);
            const isSelected = selectedAnswer === option;

            return (
              <Animated.View
                key={index}
                entering={RNFadeIn.delay(index * entrance.staggerDelay).duration(timing.normal)}
                layout={Layout.springify()}
              >
                <AnimatedPressable
                  onPress={() => !showResult && selectAnswer(option)}
                  disabled={showResult}
                  style={[styles.optionButton, style]}
                  disableAnimation={showResult}
                >
                  <View
                    style={[
                      styles.optionLetter,
                      {
                        backgroundColor:
                          isSelected && !showResult ? colors.primary : colors.backgroundSecondary,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionLetterText,
                        {
                          color: isSelected && !showResult ? "#FFFFFF" : colors.textSecondary,
                        },
                      ]}
                    >
                      {optionLetter}
                    </Text>
                  </View>
                  <Text style={[styles.optionText, { color: colors.text }]} numberOfLines={3}>
                    {option}
                  </Text>
                  {isSelected && showResult && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  )}
                </AnimatedPressable>
              </Animated.View>
            );
          })}
        </View>

        {/* Submit/Next Button */}
        <View style={styles.buttonContainer}>
          {!showResult ? (
            <AnimatedPressable
              onPress={handleSubmitAnswer}
              disabled={!selectedAnswer}
              style={[
                styles.submitButton,
                {
                  backgroundColor: colors.warning,
                  opacity: !selectedAnswer ? 0.5 : 1,
                },
              ]}
            >
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </AnimatedPressable>
          ) : (
            <AnimatedPressable
              onPress={handleNextQuestion}
              disabled={isSubmitting}
              style={[
                styles.submitButton,
                { backgroundColor: colors.primary },
                isSubmitting && styles.submitButtonDisabled,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isLastQuestion ? "See Results" : "Next Question"}
                </Text>
              )}
            </AnimatedPressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  closeButton: {
    padding: 8,
  },
  challengeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(255, 149, 0, 0.15)",
  },
  challengeBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "700",
  },
  progressSection: {
    marginBottom: 24,
  },
  progressTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  questionCard: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 26,
  },
  optionsContainer: {
    flex: 1,
    gap: 12,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 12,
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLetterText: {
    fontSize: 14,
    fontWeight: "700",
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 16,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
