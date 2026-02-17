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

import { useForgotPassword, getApiErrorMessage } from "@/services";
import { useColors } from "@/theme";

export default function ForgotPasswordScreen() {
  const colors = useColors();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);

    try {
      await forgotPasswordMutation.mutateAsync({ email });
      setSuccess(true);
    } catch (err) {
      const message = getApiErrorMessage(err);
      // Show generic success message for security (don't reveal if email exists)
      // In production, the backend should always return success to prevent email enumeration
      if (message.includes("not found") || message.includes("404")) {
        setSuccess(true); // Don't reveal that email doesn't exist
      } else {
        setError(message || "Failed to send email. Please try again.");
      }
    }
  };

  if (success) {
    return (
      <Box flex={1} bg={colors.background} px="$6" justifyContent="center">
        <Center>
          <Heading size="xl" color={colors.primary} textAlign="center">
            Email Sent!
          </Heading>
          <Text size="md" color={colors.textSecondary} mt="$4" textAlign="center" lineHeight="$lg">
            If an account with that email exists, you'll receive instructions to reset your
            password.
          </Text>
          <Button
            size="lg"
            bgColor={colors.primary}
            onPress={() => router.back()}
            mt="$8"
            w="$full"
          >
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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: colors.background }}
      >
        <Box flex={1} bg={colors.background} px="$6" pt="$16">
          <Pressable onPress={() => router.back()} mb="$8">
            <Icon as={ArrowLeftIcon} size="xl" color={colors.text} />
          </Pressable>

          <VStack space="md">
            <Heading size="2xl" color={colors.text}>
              Forgot Password?
            </Heading>
            <Text size="md" color={colors.textSecondary} mb="$6">
              Enter your email and we'll send you instructions to reset your password.
            </Text>

            <FormControl isInvalid={!!error}>
              <FormControlLabel>
                <FormControlLabelText color={colors.text}>Email</FormControlLabelText>
              </FormControlLabel>
              <Input
                size="lg"
                variant="outline"
                borderColor={colors.cardBorder}
                $focus-borderColor={colors.primary}
              >
                <InputField
                  placeholder="email@example.com"
                  placeholderTextColor={colors.textTertiary}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError(null);
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  color={colors.text}
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
              bgColor={colors.primary}
              onPress={handleSubmit}
              isDisabled={forgotPasswordMutation.isPending}
              mt="$4"
              opacity={forgotPasswordMutation.isPending ? 0.7 : 1}
            >
              <ButtonText>
                {forgotPasswordMutation.isPending ? "Sending..." : "Send Request"}
              </ButtonText>
            </Button>

            <Center mt="$6">
              <Link href="/(auth)/login">
                <Text color={colors.primary} fontWeight="$medium">
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
