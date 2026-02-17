import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import {
  Box,
  Button,
  ButtonText,
  Center,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  Heading,
  Input,
  InputField,
  Text,
  VStack,
} from "@gluestack-ui/themed";

import { useAuthStore } from "@/stores/auth.store";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      router.replace("/(main)/(tabs)");
    } catch {
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Box flex={1} bg="$white" px="$6" justifyContent="center">
          <Center mb="$10">
            <Heading size="2xl" color="$primary600">
              QuizApp
            </Heading>
            <Text size="md" color="$textLight500" mt="$2">
              Sign in to continue
            </Text>
          </Center>

          <VStack space="lg">
            <FormControl isInvalid={!!error}>
              <FormControlLabel>
                <FormControlLabelText>Email</FormControlLabelText>
              </FormControlLabel>
              <Input size="lg" variant="outline">
                <InputField
                  placeholder="email@example.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </Input>
            </FormControl>

            <FormControl isInvalid={!!error}>
              <FormControlLabel>
                <FormControlLabelText>Password</FormControlLabelText>
              </FormControlLabel>
              <Input size="lg" variant="outline">
                <InputField
                  placeholder="Enter password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </Input>
              {error && (
                <FormControlError>
                  <FormControlErrorText>{error}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <Link href="/(auth)/forgot-password" asChild>
              <Text size="sm" color="$primary600" textAlign="right" fontWeight="$medium">
                Forgot password?
              </Text>
            </Link>

            <Button
              size="lg"
              bgColor="$primary600"
              onPress={handleLogin}
              isDisabled={isLoading}
              mt="$4"
            >
              <ButtonText>{isLoading ? "Signing in..." : "Sign In"}</ButtonText>
            </Button>

            <Center mt="$6">
              <Text size="sm" color="$textLight500">
                Don't have an account?{" "}
                <Link href="/(auth)/register">
                  <Text color="$primary600" fontWeight="$bold">
                    Sign Up
                  </Text>
                </Link>
              </Text>
            </Center>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
