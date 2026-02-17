import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Link, router } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useAuthStore } from "@/stores/auth.store";
import { getApiErrorMessage } from "@/services/api-client";
import { useColors } from "@/theme";
import { FadeIn, AnimatedPressable } from "@/components/ui";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuthStore();
  const colors = useColors();

  // Shake animation for error
  const shakeX = useSharedValue(0);

  const triggerShake = () => {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      triggerShake();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      router.replace("/(main)/(tabs)");
    } catch (err) {
      const errorMessage = getApiErrorMessage(err);
      console.error("[Login] Error:", errorMessage, err);
      setError(errorMessage);
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.backgroundSecondary,
      color: colors.text,
      borderColor: error ? colors.error : "transparent",
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Logo Section */}
          <FadeIn delay={0}>
            <View style={styles.logoSection}>
              <Text style={[styles.logoText, { color: colors.primary }]}>QuizApp</Text>
              <Text style={[styles.tagline, { color: colors.textSecondary }]}>
                Sign in to continue
              </Text>
            </View>
          </FadeIn>

          {/* Form Section */}
          <Animated.View style={shakeStyle}>
            <FadeIn delay={100}>
              <View style={styles.formSection}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>Email</Text>
                  <TextInput
                    style={inputStyle}
                    placeholder="email@example.com"
                    placeholderTextColor={colors.textTertiary}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                  <TextInput
                    style={inputStyle}
                    placeholder="Enter password"
                    placeholderTextColor={colors.textTertiary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoComplete="password"
                  />
                </View>

                {error && (
                  <FadeIn>
                    <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
                  </FadeIn>
                )}

                <Link href="/(auth)/forgot-password" asChild>
                  <AnimatedPressable>
                    <Text style={[styles.forgotPassword, { color: colors.primary }]}>
                      Forgot password?
                    </Text>
                  </AnimatedPressable>
                </Link>
              </View>
            </FadeIn>
          </Animated.View>

          {/* Button Section */}
          <FadeIn delay={200}>
            <AnimatedPressable
              onPress={handleLogin}
              disabled={isLoading}
              style={[
                styles.signInButton,
                {
                  backgroundColor: colors.primary,
                  opacity: isLoading ? 0.7 : 1,
                },
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.signInButtonText}>Sign In</Text>
              )}
            </AnimatedPressable>
          </FadeIn>

          {/* Sign Up Link */}
          <FadeIn delay={300}>
            <View style={styles.signUpSection}>
              <Text style={[styles.signUpText, { color: colors.textSecondary }]}>
                Don't have an account?{" "}
              </Text>
              <Link href="/(auth)/register" asChild>
                <AnimatedPressable>
                  <Text style={[styles.signUpLink, { color: colors.primary }]}>Sign Up</Text>
                </AnimatedPressable>
              </Link>
            </View>
          </FadeIn>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "700",
  },
  tagline: {
    fontSize: 16,
    marginTop: 8,
  },
  formSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 2,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 12,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "right",
  },
  signInButton: {
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  signUpSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    fontSize: 14,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: "700",
  },
});
