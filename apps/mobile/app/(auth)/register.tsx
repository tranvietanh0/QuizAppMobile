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
import { getApiErrorMessage } from "@/services/api-client";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuthStore();

  const handleRegister = async () => {
    if (!email || !username || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
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
        <Box flex={1} bg="$white" px="$6" justifyContent="center" py="$10">
          <Center mb="$8">
            <Heading size="2xl" color="$primary600">
              Create Account
            </Heading>
            <Text size="md" color="$textLight500" mt="$2">
              Sign up to get started
            </Text>
          </Center>

          <VStack space="md">
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

            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Username</FormControlLabelText>
              </FormControlLabel>
              <Input size="lg" variant="outline">
                <InputField
                  placeholder="username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </Input>
            </FormControl>

            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Password</FormControlLabelText>
              </FormControlLabel>
              <Input size="lg" variant="outline">
                <InputField
                  placeholder="At least 6 characters"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </Input>
            </FormControl>

            <FormControl isInvalid={!!error}>
              <FormControlLabel>
                <FormControlLabelText>Confirm Password</FormControlLabelText>
              </FormControlLabel>
              <Input size="lg" variant="outline">
                <InputField
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </Input>
              {error && (
                <FormControlError>
                  <FormControlErrorText>{error}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <Button
              size="lg"
              bgColor="$primary600"
              onPress={handleRegister}
              isDisabled={isLoading}
              mt="$4"
            >
              <ButtonText>{isLoading ? "Creating account..." : "Sign Up"}</ButtonText>
            </Button>

            <Center mt="$6">
              <Text size="sm" color="$textLight500">
                Already have an account?{" "}
                <Link href="/(auth)/login">
                  <Text color="$primary600" fontWeight="$bold">
                    Sign In
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
