import { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  ButtonText,
  Pressable,
  Center,
  Progress,
  ProgressFilledTrack,
  Spinner,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, BackHandler } from "react-native";

import { useSubmitAnswer, useCompleteQuiz, useAbandonQuiz } from "@/services";
import { useQuizStore } from "@/stores/quiz.store";

export default function QuizPlayScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();

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

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

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
      // Last question - complete the quiz
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

  if (!currentQuestion) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <Center flex={1}>
          <Spinner size="large" color="$primary600" />
        </Center>
      </SafeAreaView>
    );
  }

  const getOptionStyle = (option: string) => {
    if (!showResult) {
      return {
        bg: selectedAnswer === option ? "$primary50" : "$white",
        borderColor: selectedAnswer === option ? "$primary600" : "$borderLight200",
      };
    }

    if (option === lastResult?.correctAnswer) {
      return { bg: "#DCFCE7", borderColor: "#22C55E" };
    }
    if (option === selectedAnswer && !lastResult?.isCorrect) {
      return { bg: "#FEE2E2", borderColor: "#EF4444" };
    }
    return { bg: "$white", borderColor: "$borderLight200" };
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Box flex={1} px="$4" py="$4">
        {/* Header */}
        <HStack justifyContent="space-between" alignItems="center" mb="$4">
          <Pressable onPress={handleQuit} p="$2">
            <Ionicons name="close" size={24} color="#6B7280" />
          </Pressable>

          <HStack alignItems="center" space="xs">
            <Ionicons name="time-outline" size={20} color="#6B7280" />
            <Text
              size="lg"
              fontWeight="$bold"
              color={timeRemaining <= 10 ? "$error600" : "$textDark900"}
            >
              {timeRemaining}s
            </Text>
          </HStack>
        </HStack>

        {/* Progress */}
        <VStack space="xs" mb="$6">
          <HStack justifyContent="space-between">
            <Text size="sm" color="$textLight500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Text>
          </HStack>
          <Progress value={progress} size="sm" bg="$backgroundLight200">
            <ProgressFilledTrack bg="$primary600" />
          </Progress>
        </VStack>

        {/* Question */}
        <Box
          bg="$backgroundLight50"
          rounded="$xl"
          p="$5"
          mb="$6"
          borderWidth={1}
          borderColor="$borderLight200"
        >
          <Heading size="md" color="$textDark900" textAlign="center">
            {currentQuestion.content}
          </Heading>
        </Box>

        {/* Options */}
        <VStack space="sm" flex={1}>
          {currentQuestion.options.map((option, index) => {
            const style = getOptionStyle(option);
            const optionLetter = String.fromCharCode(65 + index);

            return (
              <Pressable
                key={index}
                onPress={() => !showResult && selectAnswer(option)}
                disabled={showResult}
              >
                <Box
                  p="$4"
                  rounded="$lg"
                  borderWidth={2}
                  bg={style.bg}
                  borderColor={style.borderColor}
                >
                  <HStack alignItems="center" space="md">
                    <Center
                      w="$8"
                      h="$8"
                      rounded="$full"
                      bg={
                        selectedAnswer === option && !showResult
                          ? "$primary600"
                          : "$backgroundLight200"
                      }
                    >
                      <Text
                        size="sm"
                        fontWeight="$bold"
                        color={
                          selectedAnswer === option && !showResult ? "$white" : "$textLight600"
                        }
                      >
                        {optionLetter}
                      </Text>
                    </Center>
                    <Text flex={1} size="md" color="$textDark900">
                      {option}
                    </Text>
                    {showResult && option === lastResult?.correctAnswer && (
                      <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                    )}
                    {showResult && option === selectedAnswer && !lastResult?.isCorrect && (
                      <Ionicons name="close-circle" size={24} color="#EF4444" />
                    )}
                  </HStack>
                </Box>
              </Pressable>
            );
          })}
        </VStack>

        {/* Result explanation */}
        {showResult && lastResult?.explanation && (
          <Box bg="$backgroundLight50" rounded="$lg" p="$4" my="$4">
            <Text size="sm" color="$textLight600">
              {lastResult.explanation}
            </Text>
          </Box>
        )}

        {/* Submit/Next Button */}
        <Box mt="$4">
          {!showResult ? (
            <Button
              size="xl"
              bg="$primary600"
              rounded="$xl"
              onPress={handleSubmitAnswer}
              isDisabled={!selectedAnswer || submitAnswerMutation.isPending}
            >
              {submitAnswerMutation.isPending ? (
                <Spinner color="$white" />
              ) : (
                <ButtonText fontWeight="$bold">Submit Answer</ButtonText>
              )}
            </Button>
          ) : (
            <Button
              size="xl"
              bg={lastResult?.isCorrect ? "$success600" : "$primary600"}
              rounded="$xl"
              onPress={handleNextQuestion}
            >
              <ButtonText fontWeight="$bold">
                {currentQuestionIndex >= questions.length - 1 ? "See Results" : "Next Question"}
              </ButtonText>
            </Button>
          )}
        </Box>
      </Box>
    </SafeAreaView>
  );
}
