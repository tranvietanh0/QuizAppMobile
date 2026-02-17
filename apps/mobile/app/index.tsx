import { Redirect } from "expo-router";

import { useAuthStore } from "@/stores/auth.store";

/**
 * Entry point - redirects to appropriate screen based on auth state
 */
export default function Index() {
  const { isAuthenticated, isInitialized } = useAuthStore();

  // Wait for auth initialization
  if (!isInitialized) {
    return null;
  }

  // Redirect based on auth state
  if (isAuthenticated) {
    return <Redirect href="/(main)/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
