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

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuthStore();
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

  const handleRegister = async () => {
    if (!email || !username || !password || !confirmPassword) {
      setError("Please fill in all fields");
      triggerShake();
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      triggerShake();
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      triggerShake();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await register(email, username, password);
      router.replace("/(main)/(tabs)");
    } catch (err) {
      const errorMessage = getApiErrorMessage(err);
      console.error("[Register] Error:", errorMessage, err);
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
              <Text style={[styles.logoText, { color: colors.primary }]}>Create Account</Text>
              <Text style={[styles.tagline, { color: colors.textSecondary }]}>
                Sign up to get started
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
                  <Text style={[styles.label, { color: colors.text }]}>Username</Text>
                  <TextInput
                    style={inputStyle}
                    placeholder="username"
                    placeholderTextColor={colors.textTertiary}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoComplete="username"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                  <TextInput
                    style={inputStyle}
                    placeholder="At least 6 characters"
                    placeholderTextColor={colors.textTertiary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoComplete="password-new"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
                  <TextInput
                    style={inputStyle}
                    placeholder="Re-enter password"
                    placeholderTextColor={colors.textTertiary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoComplete="password-new"
                  />
                </View>

                {error && (
                  <FadeIn>
                    <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
                  </FadeIn>
                )}
              </View>
            </FadeIn>
          </Animated.View>

          {/* Button Section */}
          <FadeIn delay={200}>
            <AnimatedPressable
              onPress={handleRegister}
              disabled={isLoading}
              style={[
                styles.signUpButton,
                {
                  backgroundColor: colors.primary,
                  opacity: isLoading ? 0.7 : 1,
                },
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              )}
            </AnimatedPressable>
          </FadeIn>

          {/* Sign In Link */}
          <FadeIn delay={300}>
            <View style={styles.signInSection}>
              <Text style={[styles.signInText, { color: colors.textSecondary }]}>
                Already have an account?{" "}
              </Text>
              <Link href="/(auth)/login" asChild>
                <AnimatedPressable>
                  <Text style={[styles.signInLink, { color: colors.primary }]}>Sign In</Text>
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
    paddingVertical: 40,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
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
    marginBottom: 16,
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
    marginTop: 4,
  },
  signUpButton: {
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  signInSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signInText: {
    fontSize: 14,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: "700",
  },
});
