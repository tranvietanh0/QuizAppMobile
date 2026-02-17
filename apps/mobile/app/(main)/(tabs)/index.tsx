import { ScrollView } from "react-native";
import { router } from "expo-router";
import { Box, Heading, Text, VStack, HStack, Pressable, Center } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "@/stores/auth.store";

// Mock categories data
const CATEGORIES = [
  { id: "1", name: "Science", icon: "beaker", color: "#3B82F6" },
  { id: "2", name: "History", icon: "book", color: "#8B5CF6" },
  { id: "3", name: "Geography", icon: "globe", color: "#22C55E" },
  { id: "4", name: "Sports", icon: "trophy", color: "#F59E0B" },
  { id: "5", name: "Music", icon: "music", color: "#EF4444" },
  { id: "6", name: "Movies", icon: "film", color: "#EC4899" },
];

export default function HomeScreen() {
  const { user } = useAuthStore();

  const handleStartQuiz = (categoryId: string) => {
    router.push(`/(main)/quiz/${categoryId}` as never);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box px="$4" py="$6">
          {/* Header */}
          <VStack space="xs" mb="$6">
            <Text size="md" color="$textLight500">
              Hello,
            </Text>
            <Heading size="xl" color="$textDark900">
              {user?.displayName || user?.username || "Player"}
            </Heading>
          </VStack>

          {/* Daily Challenge Card */}
          <Pressable
            onPress={() => {
              // TODO: Navigate to daily challenge
            }}
          >
            <Box bg="$primary600" rounded="$xl" p="$5" mb="$6" overflow="hidden">
              <HStack justifyContent="space-between" alignItems="center">
                <VStack space="xs" flex={1}>
                  <Text size="sm" color="$white" opacity={0.9}>
                    Daily Challenge
                  </Text>
                  <Heading size="lg" color="$white">
                    10 questions - 5 min
                  </Heading>
                  <Text size="xs" color="$white" opacity={0.7} mt="$1">
                    Complete to earn coins!
                  </Text>
                </VStack>
                <Center bg="$white" w="$12" h="$12" rounded="$full" opacity={0.9}>
                  <Ionicons name="play" size={24} color="#6366F1" />
                </Center>
              </HStack>
            </Box>
          </Pressable>

          {/* Categories Section */}
          <VStack space="md">
            <HStack justifyContent="space-between" alignItems="center">
              <Heading size="md" color="$textDark900">
                Categories
              </Heading>
              <Pressable>
                <Text size="sm" color="$primary600" fontWeight="$medium">
                  View all
                </Text>
              </Pressable>
            </HStack>

            {/* Category Grid */}
            <HStack flexWrap="wrap" marginHorizontal={-4}>
              {CATEGORIES.map((category) => (
                <Box key={category.id} w="$1/2" p="$1">
                  <Pressable onPress={() => handleStartQuiz(category.id)}>
                    <Box
                      bg="$backgroundLight50"
                      rounded="$xl"
                      p="$4"
                      borderWidth={1}
                      borderColor="$borderLight200"
                    >
                      <Center
                        w="$12"
                        h="$12"
                        rounded="$lg"
                        mb="$3"
                        style={{ backgroundColor: category.color + "20" }}
                      >
                        <Text fontSize="$xl" fontWeight="$bold" style={{ color: category.color }}>
                          {category.name.charAt(0)}
                        </Text>
                      </Center>
                      <Text size="md" fontWeight="$semibold" color="$textDark900">
                        {category.name}
                      </Text>
                      <Text size="xs" color="$textLight500" mt="$1">
                        50 questions
                      </Text>
                    </Box>
                  </Pressable>
                </Box>
              ))}
            </HStack>
          </VStack>

          {/* Recent Activity */}
          <VStack space="md" mt="$6">
            <Heading size="md" color="$textDark900">
              Recent Activity
            </Heading>
            <Box
              bg="$backgroundLight50"
              rounded="$xl"
              p="$4"
              borderWidth={1}
              borderColor="$borderLight200"
            >
              <Center py="$4">
                <Text size="sm" color="$textLight500">
                  No recent activity
                </Text>
              </Center>
            </Box>
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
