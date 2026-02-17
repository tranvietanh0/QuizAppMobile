import { useState } from "react";
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
  Spinner,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCategory, useStartQuiz, type SessionQuestion } from "@/services";
import { useQuizStore } from "@/stores/quiz.store";

type DifficultyType = "EASY" | "MEDIUM" | "HARD";

const DIFFICULTIES: { value: DifficultyType; label: string; color: string }[] = [
  { value: "EASY", label: "Easy", color: "#22C55E" },
  { value: "MEDIUM", label: "Medium", color: "#F59E0B" },
  { value: "HARD", label: "Hard", color: "#EF4444" },
];

const QUESTION_COUNTS = [5, 10, 15, 20];

export default function CategoryQuizScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { data: category, isLoading: categoryLoading } = useCategory(categoryId || "");

  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyType>("MEDIUM");
  const [questionCount, setQuestionCount] = useState(10);

  const startQuizMutation = useStartQuiz();
  const {
    setSessionId,
    setQuestions,
    setSelectedCategory,
    setSelectedDifficulty: setStoreDifficulty,
  } = useQuizStore();

  const handleStartQuiz = async () => {
    if (!categoryId) return;

    try {
      const result = await startQuizMutation.mutateAsync({
        categoryId,
        difficulty: selectedDifficulty,
        questionCount,
      });

      // Update quiz store
      if (category) {
        setSelectedCategory(category);
      }
      setStoreDifficulty(selectedDifficulty.toLowerCase() as "easy" | "medium" | "hard");
      setSessionId(result.id);
      setQuestions(result.questions as SessionQuestion[]);

      // Navigate to play screen
      router.push({
        pathname: "/(main)/quiz/play" as const,
        params: { sessionId: result.id },
      } as never);
    } catch (error) {
      console.error("Failed to start quiz:", error);
    }
  };

  if (categoryLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <Center flex={1}>
          <Spinner size="large" color="$primary600" />
        </Center>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Box flex={1} px="$4" py="$4">
        {/* Header */}
        <HStack alignItems="center" mb="$6">
          <Pressable onPress={() => router.back()} p="$2" mr="$2">
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </Pressable>
          <VStack flex={1}>
            <Text size="sm" color="$textLight500">
              Start Quiz
            </Text>
            <Heading size="lg" color="$textDark900">
              {category?.name || "Category"}
            </Heading>
          </VStack>
        </HStack>

        {/* Category Info */}
        <Box
          bg="$backgroundLight50"
          rounded="$xl"
          p="$5"
          mb="$6"
          borderWidth={1}
          borderColor="$borderLight200"
        >
          <HStack space="md" alignItems="center">
            <Center
              w="$16"
              h="$16"
              rounded="$xl"
              style={{ backgroundColor: (category?.color || "#3B82F6") + "20" }}
            >
              <Text
                fontSize="$2xl"
                fontWeight="$bold"
                style={{ color: category?.color || "#3B82F6" }}
              >
                {category?.name?.charAt(0) || "?"}
              </Text>
            </Center>
            <VStack flex={1}>
              <Heading size="md" color="$textDark900">
                {category?.name}
              </Heading>
              <Text size="sm" color="$textLight500" numberOfLines={2}>
                {category?.description || "Test your knowledge"}
              </Text>
              <Text size="xs" color="$textLight400" mt="$1">
                {category?.questionCount || 0} questions available
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Difficulty Selection */}
        <VStack space="md" mb="$6">
          <Heading size="sm" color="$textDark900">
            Select Difficulty
          </Heading>
          <HStack space="sm">
            {DIFFICULTIES.map((diff) => (
              <Pressable
                key={diff.value}
                flex={1}
                onPress={() => setSelectedDifficulty(diff.value)}
              >
                <Box
                  py="$3"
                  rounded="$lg"
                  borderWidth={2}
                  borderColor={selectedDifficulty === diff.value ? diff.color : "$borderLight200"}
                  bg={selectedDifficulty === diff.value ? diff.color + "15" : "$white"}
                >
                  <Center>
                    <Text
                      size="sm"
                      fontWeight="$semibold"
                      style={{
                        color: selectedDifficulty === diff.value ? diff.color : "#6B7280",
                      }}
                    >
                      {diff.label}
                    </Text>
                  </Center>
                </Box>
              </Pressable>
            ))}
          </HStack>
        </VStack>

        {/* Question Count Selection */}
        <VStack space="md" mb="$8">
          <Heading size="sm" color="$textDark900">
            Number of Questions
          </Heading>
          <HStack space="sm">
            {QUESTION_COUNTS.map((count) => (
              <Pressable key={count} flex={1} onPress={() => setQuestionCount(count)}>
                <Box
                  py="$3"
                  rounded="$lg"
                  borderWidth={2}
                  borderColor={questionCount === count ? "$primary600" : "$borderLight200"}
                  bg={questionCount === count ? "$primary50" : "$white"}
                >
                  <Center>
                    <Text
                      size="sm"
                      fontWeight="$semibold"
                      color={questionCount === count ? "$primary600" : "$textLight500"}
                    >
                      {count}
                    </Text>
                  </Center>
                </Box>
              </Pressable>
            ))}
          </HStack>
        </VStack>

        {/* Start Button */}
        <Box mt="auto">
          <Button
            size="xl"
            bg="$primary600"
            rounded="$xl"
            onPress={handleStartQuiz}
            isDisabled={startQuizMutation.isPending}
          >
            {startQuizMutation.isPending ? (
              <Spinner color="$white" />
            ) : (
              <ButtonText fontWeight="$bold">Start Quiz</ButtonText>
            )}
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
