import { router, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  ButtonText,
  Center,
  Spinner,
  Divider,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useQuizSession } from "@/services";
import { useQuizStore } from "@/stores/quiz.store";

export default function QuizResultScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { data: session, isLoading } = useQuizSession(sessionId || "");
  const { resetQuiz } = useQuizStore();

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
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <Center flex={1}>
          <Spinner size="large" color="$primary600" />
        </Center>
      </SafeAreaView>
    );
  }

  const accuracy =
    session.totalQuestions > 0
      ? Math.round((session.correctAnswers / session.totalQuestions) * 100)
      : 0;

  const getScoreColor = () => {
    if (accuracy >= 80) return "#22C55E";
    if (accuracy >= 50) return "#F59E0B";
    return "#EF4444";
  };

  const getScoreMessage = () => {
    if (accuracy >= 80) return "Excellent! 🎉";
    if (accuracy >= 60) return "Good job! 👍";
    if (accuracy >= 40) return "Not bad! 💪";
    return "Keep practicing! 📚";
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box px="$4" py="$6">
          {/* Header */}
          <Center mb="$8">
            <Box
              w="$24"
              h="$24"
              rounded="$full"
              bg={getScoreColor() + "20"}
              justifyContent="center"
              alignItems="center"
              mb="$4"
            >
              <Text fontSize="$3xl" fontWeight="$bold" style={{ color: getScoreColor() }}>
                {accuracy}%
              </Text>
            </Box>
            <Heading size="xl" color="$textDark900" textAlign="center">
              {getScoreMessage()}
            </Heading>
            <Text size="md" color="$textLight500" mt="$2">
              Quiz Completed
            </Text>
          </Center>

          {/* Stats */}
          <Box
            bg="$backgroundLight50"
            rounded="$xl"
            p="$5"
            mb="$6"
            borderWidth={1}
            borderColor="$borderLight200"
          >
            <HStack justifyContent="space-around">
              <VStack alignItems="center">
                <Text size="2xl" fontWeight="$bold" color="$primary600">
                  {session.score}
                </Text>
                <Text size="sm" color="$textLight500">
                  Points
                </Text>
              </VStack>

              <Divider orientation="vertical" bg="$borderLight200" />

              <VStack alignItems="center">
                <Text size="2xl" fontWeight="$bold" color="$success600">
                  {session.correctAnswers}
                </Text>
                <Text size="sm" color="$textLight500">
                  Correct
                </Text>
              </VStack>

              <Divider orientation="vertical" bg="$borderLight200" />

              <VStack alignItems="center">
                <Text size="2xl" fontWeight="$bold" color="$error600">
                  {session.totalQuestions - session.correctAnswers}
                </Text>
                <Text size="sm" color="$textLight500">
                  Wrong
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* Category Info */}
          <Box
            bg="$backgroundLight50"
            rounded="$xl"
            p="$4"
            mb="$6"
            borderWidth={1}
            borderColor="$borderLight200"
          >
            <HStack alignItems="center" space="md">
              <Center w="$12" h="$12" rounded="$lg" bg="$primary100">
                <Ionicons name="book" size={24} color="#6366F1" />
              </Center>
              <VStack flex={1}>
                <Text size="sm" color="$textLight500">
                  Category
                </Text>
                <Heading size="sm" color="$textDark900">
                  {session.categoryName}
                </Heading>
              </VStack>
              <VStack alignItems="flex-end">
                <Text size="sm" color="$textLight500">
                  Questions
                </Text>
                <Text size="md" fontWeight="$semibold" color="$textDark900">
                  {session.totalQuestions}
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* Performance Summary */}
          <VStack space="sm" mb="$8">
            <Heading size="sm" color="$textDark900" mb="$2">
              Performance Summary
            </Heading>

            <HStack
              bg="$backgroundLight50"
              rounded="$lg"
              p="$4"
              justifyContent="space-between"
              alignItems="center"
            >
              <HStack space="sm" alignItems="center">
                <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
                <Text size="sm" color="$textDark700">
                  Accuracy
                </Text>
              </HStack>
              <Text size="sm" fontWeight="$semibold" color="$textDark900">
                {accuracy}%
              </Text>
            </HStack>

            <HStack
              bg="$backgroundLight50"
              rounded="$lg"
              p="$4"
              justifyContent="space-between"
              alignItems="center"
            >
              <HStack space="sm" alignItems="center">
                <Ionicons name="star" size={20} color="#F59E0B" />
                <Text size="sm" color="$textDark700">
                  Total Score
                </Text>
              </HStack>
              <Text size="sm" fontWeight="$semibold" color="$textDark900">
                {session.score} pts
              </Text>
            </HStack>

            <HStack
              bg="$backgroundLight50"
              rounded="$lg"
              p="$4"
              justifyContent="space-between"
              alignItems="center"
            >
              <HStack space="sm" alignItems="center">
                <Ionicons name="analytics" size={20} color="#6366F1" />
                <Text size="sm" color="$textDark700">
                  Status
                </Text>
              </HStack>
              <Text
                size="sm"
                fontWeight="$semibold"
                color={session.status === "COMPLETED" ? "$success600" : "$warning600"}
              >
                {session.status === "COMPLETED" ? "Completed" : "Abandoned"}
              </Text>
            </HStack>
          </VStack>

          {/* Action Buttons */}
          <VStack space="sm">
            <Button size="xl" bg="$primary600" rounded="$xl" onPress={handlePlayAgain}>
              <HStack space="sm" alignItems="center">
                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                <ButtonText fontWeight="$bold">Play Again</ButtonText>
              </HStack>
            </Button>

            <Button
              size="xl"
              variant="outline"
              borderColor="$borderLight300"
              rounded="$xl"
              onPress={handleGoHome}
            >
              <HStack space="sm" alignItems="center">
                <Ionicons name="home" size={20} color="#6366F1" />
                <ButtonText fontWeight="$bold" color="$primary600">
                  Back to Home
                </ButtonText>
              </HStack>
            </Button>
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
