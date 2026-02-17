import { ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Center,
  Avatar,
  AvatarFallbackText,
  Pressable,
  Icon,
  SettingsIcon,
  ChevronRightIcon,
} from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "@/stores/auth.store";

// Stats mock data
const STATS = [
  { label: "Tong quiz", value: "24" },
  { label: "Dung", value: "85%" },
  { label: "Streak", value: "5" },
];

// Menu items
const MENU_ITEMS = [
  { id: "achievements", label: "Thanh tich", icon: "trophy" },
  { id: "history", label: "Lich su choi", icon: "clock" },
  { id: "settings", label: "Cai dat", icon: "settings" },
  { id: "help", label: "Tro giup", icon: "help" },
];

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert("Dang xuat", "Ban co chac chan muon dang xuat?", [
      {
        text: "Huy",
        style: "cancel",
      },
      {
        text: "Dang xuat",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleMenuPress = (itemId: string) => {
    // TODO: Navigate to corresponding screen
    console.log("Menu item pressed:", itemId);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box px="$4" py="$6">
          {/* Header */}
          <HStack justifyContent="space-between" alignItems="center" mb="$6">
            <Heading size="2xl" color="$textDark900">
              Ho so
            </Heading>
            <Pressable
              p="$2"
              rounded="$full"
              bg="$backgroundLight100"
              onPress={() => handleMenuPress("settings")}
            >
              <Icon as={SettingsIcon} size="xl" color="$textDark700" />
            </Pressable>
          </HStack>

          {/* Profile Card */}
          <Box
            bg="$primary600"
            rounded="$2xl"
            p="$6"
            mb="$6"
            overflow="hidden"
          >
            <HStack space="lg" alignItems="center">
              <Avatar size="xl" bgColor="$white">
                <AvatarFallbackText>
                  {user?.displayName?.charAt(0) ||
                    user?.username?.charAt(0) ||
                    "U"}
                </AvatarFallbackText>
              </Avatar>
              <VStack flex={1}>
                <Heading size="lg" color="$white">
                  {user?.displayName || user?.username || "Nguoi dung"}
                </Heading>
                <Text size="sm" color="$white" opacity={0.8} mt="$1">
                  {user?.email || "email@example.com"}
                </Text>
              </VStack>
            </HStack>

            {/* Stats */}
            <HStack mt="$6" justifyContent="space-around">
              {STATS.map((stat, index) => (
                <VStack key={index} alignItems="center">
                  <Text size="xl" fontWeight="$bold" color="$white">
                    {stat.value}
                  </Text>
                  <Text size="xs" color="$white" opacity={0.8}>
                    {stat.label}
                  </Text>
                </VStack>
              ))}
            </HStack>
          </Box>

          {/* Menu Items */}
          <VStack space="sm" mb="$6">
            {MENU_ITEMS.map((item) => (
              <Pressable key={item.id} onPress={() => handleMenuPress(item.id)}>
                <Box
                  bg="$backgroundLight50"
                  rounded="$xl"
                  p="$4"
                  borderWidth={1}
                  borderColor="$borderLight200"
                >
                  <HStack alignItems="center" justifyContent="space-between">
                    <HStack alignItems="center" space="md">
                      <Center
                        w="$10"
                        h="$10"
                        rounded="$lg"
                        bg="$primary100"
                      >
                        <Text color="$primary600" fontWeight="$bold">
                          {item.label.charAt(0)}
                        </Text>
                      </Center>
                      <Text size="md" fontWeight="$medium" color="$textDark900">
                        {item.label}
                      </Text>
                    </HStack>
                    <Icon
                      as={ChevronRightIcon}
                      size="lg"
                      color="$textLight400"
                    />
                  </HStack>
                </Box>
              </Pressable>
            ))}
          </VStack>

          {/* Logout Button */}
          <Pressable onPress={handleLogout}>
            <Box
              bg="$error100"
              rounded="$xl"
              p="$4"
              borderWidth={1}
              borderColor="$error200"
            >
              <Center>
                <Text size="md" fontWeight="$semibold" color="$error600">
                  Dang xuat
                </Text>
              </Center>
            </Box>
          </Pressable>

          {/* App Version */}
          <Center mt="$8">
            <Text size="xs" color="$textLight400">
              Phien ban 1.0.0
            </Text>
          </Center>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
