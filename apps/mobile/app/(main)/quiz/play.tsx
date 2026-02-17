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

import { useSubmitAnswer, useCompleteQuiz, useAbandonQuiz } from "@/services";
import { useQuizStore } from "@/stores/quiz.store";
import { useColors } from "@/theme";
import { timing, easing, entrance } from "@/theme/animations";
import { AnimatedPressable, FadeIn, Card } from "@/components/ui";

export default function QuizPlayScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
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
  } = useQuizStore();

  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string | null;
    pointsEarned: number;
  } | null>(null);

  const submitAnswerMutation = useSubmitAnswer();
  const completeQuizMutation = useCompleteQuiz();
  const abandonQuizMutation = useAbandonQuiz();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Animation values
  const progressWidth = useSharedValue(0);
  const timerPulse = useSharedValue(0);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

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
      startTimeRef.current = Date.now();

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

  const handleSubmitAnswer = async () => {
    if (!sessionId || !currentQuestion) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    const answer = selectedAnswer || "";

    try {
      const result = await submitAnswerMutation.mutateAsync({
        sessionId,
        questionId: currentQuestion.id,
        selectedAnswer: answer,
        timeSpent,
      });

      setLastResult({
        isCorrect: result.isCorrect,
        correctAnswer: result.correctAnswer,
        explanation: result.explanation,
        pointsEarned: result.pointsEarned,
      });
      setShowResult(true);
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setLastResult(null);
    selectAnswer("");

    if (currentQuestionIndex >= questions.length - 1) {
      handleCompleteQuiz();
    } else {
      nextQuestion();
    }
  };

  const handleCompleteQuiz = async () => {
    if (!sessionId) return;

    try {
      await completeQuizMutation.mutateAsync(sessionId);
      router.replace({
        pathname: "/(main)/quiz/result" as const,
        params: { sessionId },
      } as never);
    } catch (error) {
      console.error("Failed to complete quiz:", error);
    }
  };

  const handleQuit = () => {
    Alert.alert("Quit Quiz", "Are you sure you want to quit? Your progress will be lost.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Quit",
        style: "destructive",
        onPress: async () => {
          if (sessionId) {
            try {
              await abandonQuizMutation.mutateAsync(sessionId);
            } catch (error) {
              console.error("Failed to abandon quiz:", error);
            }
          }
          router.replace("/(main)/(tabs)");
        },
      },
    ]);
  };

  // Animated styles
  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const timerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + timerPulse.value * 0.1 }],
  }));

  if (!currentQuestion) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
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

    if (option === lastResult?.correctAnswer) {
      return {
        backgroundColor: colors.correctAnswer + "15",
        borderColor: colors.correctAnswer,
      };
    }
    if (option === selectedAnswer && !lastResult?.isCorrect) {
      return {
        backgroundColor: colors.wrongAnswer + "15",
        borderColor: colors.wrongAnswer,
      };
    }
    return {
      backgroundColor: colors.card,
      borderColor: colors.cardBorder,
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
                  { backgroundColor: colors.primary },
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
            const isCorrect = showResult && option === lastResult?.correctAnswer;
            const isWrong = showResult && option === selectedAnswer && !lastResult?.isCorrect;

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
                  {isCorrect && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.correctAnswer} />
                  )}
                  {isWrong && <Ionicons name="close-circle" size={24} color={colors.wrongAnswer} />}
                </AnimatedPressable>
              </Animated.View>
            );
          })}
        </View>

        {/* Result explanation */}
        {showResult && lastResult?.explanation && (
          <FadeIn>
            <Card variant="filled" padding="md" radius="lg" style={styles.explanationCard}>
              <Text style={[styles.explanationText, { color: colors.textSecondary }]}>
                {lastResult.explanation}
              </Text>
            </Card>
          </FadeIn>
        )}

        {/* Submit/Next Button */}
        <View style={styles.buttonContainer}>
          {!showResult ? (
            <AnimatedPressable
              onPress={handleSubmitAnswer}
              disabled={!selectedAnswer || submitAnswerMutation.isPending}
              style={[
                styles.submitButton,
                {
                  backgroundColor: colors.primary,
                  opacity: !selectedAnswer || submitAnswerMutation.isPending ? 0.5 : 1,
                },
              ]}
            >
              {submitAnswerMutation.isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Answer</Text>
              )}
            </AnimatedPressable>
          ) : (
            <AnimatedPressable
              onPress={handleNextQuestion}
              style={[
                styles.submitButton,
                {
                  backgroundColor: lastResult?.isCorrect ? colors.correctAnswer : colors.primary,
                },
              ]}
            >
              <Text style={styles.submitButtonText}>
                {currentQuestionIndex >= questions.length - 1 ? "See Results" : "Next Question"}
              </Text>
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
  explanationCard: {
    marginVertical: 16,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
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
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
