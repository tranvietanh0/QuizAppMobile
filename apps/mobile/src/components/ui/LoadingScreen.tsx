import { Center, Spinner, Text, VStack } from "@gluestack-ui/themed";

interface LoadingScreenProps {
  message?: string;
}

/**
 * Full-screen loading component
 */
export function LoadingScreen({ message = "Dang tai..." }: LoadingScreenProps) {
  return (
    <Center flex={1} bg="$white">
      <VStack space="md" alignItems="center">
        <Spinner size="large" color="$primary600" />
        <Text size="md" color="$textLight500">
          {message}
        </Text>
      </VStack>
    </Center>
  );
}

export default LoadingScreen;
