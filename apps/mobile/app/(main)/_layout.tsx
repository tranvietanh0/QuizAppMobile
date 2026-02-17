import { Redirect, Stack } from "expo-router";

import { useAuthStore } from "@/stores/auth.store";

/**
 * Main app layout - requires authentication
 */
export default function MainLayout() {
  const { isAuthenticated } = useAuthStore();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="quiz/[categoryId]"
        options={{
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="quiz/result"
        options={{
          presentation: "card",
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
