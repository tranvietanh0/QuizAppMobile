import {
  Box,
  Button,
  ButtonText,
  Center,
  Heading,
  Text,
  VStack,
  Icon,
  AlertCircleIcon,
} from "@gluestack-ui/themed";

interface ErrorViewProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

/**
 * Error view component for displaying errors
 */
export function ErrorView({
  title = "Something went wrong",
  message = "Unable to load data. Please try again.",
  onRetry,
  retryText = "Retry",
}: ErrorViewProps) {
  return (
    <Center flex={1} bg="$white" px="$6">
      <VStack space="lg" alignItems="center">
        <Box
          w="$20"
          h="$20"
          rounded="$full"
          bg="$error100"
          justifyContent="center"
          alignItems="center"
        >
          <Icon as={AlertCircleIcon} size="xl" color="$error500" />
        </Box>

        <VStack space="xs" alignItems="center">
          <Heading size="lg" color="$textDark900" textAlign="center">
            {title}
          </Heading>
          <Text size="md" color="$textLight500" textAlign="center" lineHeight="$lg">
            {message}
          </Text>
        </VStack>

        {onRetry && (
          <Button size="lg" bgColor="$primary600" onPress={onRetry} mt="$4">
            <ButtonText>{retryText}</ButtonText>
          </Button>
        )}
      </VStack>
    </Center>
  );
}

export default ErrorView;
