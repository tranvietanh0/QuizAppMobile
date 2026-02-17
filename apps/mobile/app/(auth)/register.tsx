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
      setError("Vui long dien day du thong tin");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mat khau khong khop");
      return;
    }

    if (password.length < 6) {
      setError("Mat khau phai co it nhat 6 ky tu");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await register(email, username, password);
      router.replace("/(main)/(tabs)");
    } catch (err) {
      setError("Dang ky that bai. Vui long thu lai.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Box flex={1} bg="$white" px="$6" justifyContent="center" py="$10">
          <Center mb="$8">
            <Heading size="2xl" color="$primary600">
              Tao tai khoan
            </Heading>
            <Text size="md" color="$textLight500" mt="$2">
              Dang ky de bat dau trai nghiem
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
                <FormControlLabelText>Ten nguoi dung</FormControlLabelText>
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
                <FormControlLabelText>Mat khau</FormControlLabelText>
              </FormControlLabel>
              <Input size="lg" variant="outline">
                <InputField
                  placeholder="It nhat 6 ky tu"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </Input>
            </FormControl>

            <FormControl isInvalid={!!error}>
              <FormControlLabel>
                <FormControlLabelText>Xac nhan mat khau</FormControlLabelText>
              </FormControlLabel>
              <Input size="lg" variant="outline">
                <InputField
                  placeholder="Nhap lai mat khau"
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
              <ButtonText>
                {isLoading ? "Dang xu ly..." : "Dang ky"}
              </ButtonText>
            </Button>

            <Center mt="$6">
              <Text size="sm" color="$textLight500">
                Da co tai khoan?{" "}
                <Link href="/(auth)/login">
                  <Text color="$primary600" fontWeight="$bold">
                    Dang nhap
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
