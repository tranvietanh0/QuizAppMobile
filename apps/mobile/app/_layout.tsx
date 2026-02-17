import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { GluestackUIProvider } from "@gluestack-ui/themed";

import { config as gluestackConfig } from "@/theme/gluestack.config";
import { ThemeProvider, useTheme } from "@/theme";
import { queryClient } from "@/services/query-client";
import { useAuthStore } from "@/stores/auth.store";

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

/**
 * Inner layout component that can access theme context
 */
function ThemedLayout() {
  const { isDark, colors } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const { initialize, isInitialized } = useAuthStore();

  useEffect(() => {
    async function initializeApp() {
      try {
        // Initialize auth state from storage
        await initialize();
      } catch (error) {
        console.error("Failed to initialize app:", error);
      } finally {
        // Hide splash screen after initialization
        await SplashScreen.hideAsync();
      }
    }

    initializeApp();
  }, [initialize]);

  if (!isInitialized) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <GluestackUIProvider config={gluestackConfig}>
            <ThemedLayout />
          </GluestackUIProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
