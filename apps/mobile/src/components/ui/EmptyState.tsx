import {
  Box,
  Button,
  ButtonText,
  Center,
  Heading,
  Text,
  VStack,
  Icon,
  InfoIcon,
} from "@gluestack-ui/themed";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ComponentType;
  actionText?: string;
  onAction?: () => void;
}

/**
 * Empty state component for lists and screens with no data
 */
export function EmptyState({
  title = "Khong co du lieu",
  message = "Chua co noi dung de hien thi.",
  icon = InfoIcon,
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <Center py="$12" px="$6">
      <VStack space="md" alignItems="center">
        <Box
          w="$16"
          h="$16"
          rounded="$full"
          bg="$backgroundLight100"
          justifyContent="center"
          alignItems="center"
        >
          <Icon as={icon} size="xl" color="$textLight400" />
        </Box>

        <VStack space="xs" alignItems="center">
          <Heading size="md" color="$textDark900" textAlign="center">
            {title}
          </Heading>
          <Text
            size="sm"
            color="$textLight500"
            textAlign="center"
            lineHeight="$md"
          >
            {message}
          </Text>
        </VStack>

        {actionText && onAction && (
          <Button
            size="md"
            variant="outline"
            borderColor="$primary600"
            onPress={onAction}
            mt="$2"
          >
            <ButtonText color="$primary600">{actionText}</ButtonText>
          </Button>
        )}
      </VStack>
    </Center>
  );
}

export default EmptyState;
