import { ScrollView } from "react-native";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Center,
  Avatar,
  AvatarFallbackText,
} from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock leaderboard data
const LEADERBOARD_DATA = [
  { rank: 1, name: "Nguyen Van A", score: 9850, avatar: "NA" },
  { rank: 2, name: "Tran Thi B", score: 9720, avatar: "TB" },
  { rank: 3, name: "Le Van C", score: 9580, avatar: "LC" },
  { rank: 4, name: "Pham Thi D", score: 9340, avatar: "PD" },
  { rank: 5, name: "Hoang Van E", score: 9100, avatar: "HE" },
];

function getRankColor(rank: number): string {
  switch (rank) {
    case 1:
      return "#F59E0B"; // Gold
    case 2:
      return "#9CA3AF"; // Silver
    case 3:
      return "#CD7F32"; // Bronze
    default:
      return "#6366F1"; // Primary
  }
}

export default function LeaderboardScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box px="$4" py="$6">
          {/* Header */}
          <VStack space="xs" mb="$6">
            <Heading size="2xl" color="$textDark900">
              Bang xep hang
            </Heading>
            <Text size="md" color="$textLight500">
              Top nguoi choi xuat sac nhat
            </Text>
          </VStack>

          {/* Top 3 Podium */}
          <HStack justifyContent="center" alignItems="flex-end" mb="$8" px="$4">
            {/* 2nd Place */}
            <VStack alignItems="center" flex={1}>
              <Avatar size="lg" bgColor="$secondary400">
                <AvatarFallbackText>
                  {LEADERBOARD_DATA[1]?.avatar}
                </AvatarFallbackText>
              </Avatar>
              <Text size="sm" fontWeight="$semibold" mt="$2" numberOfLines={1}>
                {LEADERBOARD_DATA[1]?.name.split(" ").pop()}
              </Text>
              <Box
                bg="$backgroundLight100"
                w="$full"
                h="$20"
                rounded="$lg"
                mt="$2"
                justifyContent="center"
                alignItems="center"
              >
                <Text size="2xl" fontWeight="$bold" color="$textLight500">
                  2
                </Text>
              </Box>
            </VStack>

            {/* 1st Place */}
            <VStack alignItems="center" flex={1} mx="$2">
              <Avatar size="xl" bgColor="$warning500">
                <AvatarFallbackText>
                  {LEADERBOARD_DATA[0]?.avatar}
                </AvatarFallbackText>
              </Avatar>
              <Text size="sm" fontWeight="$semibold" mt="$2" numberOfLines={1}>
                {LEADERBOARD_DATA[0]?.name.split(" ").pop()}
              </Text>
              <Box
                bg="$warning100"
                w="$full"
                h="$24"
                rounded="$lg"
                mt="$2"
                justifyContent="center"
                alignItems="center"
              >
                <Text size="2xl" fontWeight="$bold" color="$warning600">
                  1
                </Text>
              </Box>
            </VStack>

            {/* 3rd Place */}
            <VStack alignItems="center" flex={1}>
              <Avatar size="lg" bgColor="$orange400">
                <AvatarFallbackText>
                  {LEADERBOARD_DATA[2]?.avatar}
                </AvatarFallbackText>
              </Avatar>
              <Text size="sm" fontWeight="$semibold" mt="$2" numberOfLines={1}>
                {LEADERBOARD_DATA[2]?.name.split(" ").pop()}
              </Text>
              <Box
                bg="$orange100"
                w="$full"
                h="$16"
                rounded="$lg"
                mt="$2"
                justifyContent="center"
                alignItems="center"
              >
                <Text size="2xl" fontWeight="$bold" color="$orange600">
                  3
                </Text>
              </Box>
            </VStack>
          </HStack>

          {/* Full Leaderboard List */}
          <VStack space="sm">
            {LEADERBOARD_DATA.map((player) => (
              <Box
                key={player.rank}
                bg="$backgroundLight50"
                rounded="$xl"
                p="$4"
                borderWidth={1}
                borderColor="$borderLight200"
              >
                <HStack alignItems="center" space="md">
                  <Center
                    w="$8"
                    h="$8"
                    rounded="$full"
                    style={{ backgroundColor: getRankColor(player.rank) }}
                  >
                    <Text size="sm" fontWeight="$bold" color="$white">
                      {player.rank}
                    </Text>
                  </Center>
                  <Avatar size="sm" bgColor="$primary200">
                    <AvatarFallbackText>{player.avatar}</AvatarFallbackText>
                  </Avatar>
                  <VStack flex={1}>
                    <Text size="md" fontWeight="$semibold" color="$textDark900">
                      {player.name}
                    </Text>
                  </VStack>
                  <Text size="md" fontWeight="$bold" color="$primary600">
                    {player.score.toLocaleString()}
                  </Text>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
