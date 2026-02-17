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
  Icon,
  ArrowLeftIcon,
  Pressable,
} from "@gluestack-ui/themed";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Call forgot password API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch {
      setError("Failed to send email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Box flex={1} bg="$white" px="$6" justifyContent="center">
        <Center>
          <Heading size="xl" color="$primary600" textAlign="center">
            Email Sent!
          </Heading>
          <Text size="md" color="$textLight500" mt="$4" textAlign="center" lineHeight="$lg">
            Please check your inbox and follow the instructions to reset your password.
          </Text>
          <Button size="lg" bgColor="$primary600" onPress={() => router.back()} mt="$8" w="$full">
            <ButtonText>Back to Sign In</ButtonText>
          </Button>
        </Center>
      </Box>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Box flex={1} bg="$white" px="$6" pt="$16">
          <Pressable onPress={() => router.back()} mb="$8">
            <Icon as={ArrowLeftIcon} size="xl" color="$textDark900" />
          </Pressable>

          <VStack space="md">
            <Heading size="2xl" color="$textDark900">
              Forgot Password?
            </Heading>
            <Text size="md" color="$textLight500" mb="$6">
              Enter your email and we'll send you instructions to reset your password.
            </Text>

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
              {error && (
                <FormControlError>
                  <FormControlErrorText>{error}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <Button
              size="lg"
              bgColor="$primary600"
              onPress={handleSubmit}
              isDisabled={isLoading}
              mt="$4"
            >
              <ButtonText>{isLoading ? "Sending..." : "Send Request"}</ButtonText>
            </Button>

            <Center mt="$6">
              <Link href="/(auth)/login">
                <Text color="$primary600" fontWeight="$medium">
                  Back to Sign In
                </Text>
              </Link>
            </Center>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
