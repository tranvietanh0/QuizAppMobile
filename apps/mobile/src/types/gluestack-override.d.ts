// Override for gluestack-ui type compatibility with React 18
import type { ComponentType } from "react";

declare module "@gluestack-ui/themed" {
  export const Box: ComponentType<any>;
  export const Center: ComponentType<any>;
  export const VStack: ComponentType<any>;
  export const HStack: ComponentType<any>;
  export const Text: ComponentType<any>;
  export const Heading: ComponentType<any>;
  export const Button: ComponentType<any>;
  export const ButtonText: ComponentType<any>;
  export const ButtonIcon: ComponentType<any>;
  export const ButtonSpinner: ComponentType<any>;
  export const Input: ComponentType<any>;
  export const InputField: ComponentType<any>;
  export const InputIcon: ComponentType<any>;
  export const InputSlot: ComponentType<any>;
  export const Icon: ComponentType<any>;
  export const Spinner: ComponentType<any>;
  export const Image: ComponentType<any>;
  export const Pressable: ComponentType<any>;
  export const ScrollView: ComponentType<any>;
  export const Badge: ComponentType<any>;
  export const BadgeText: ComponentType<any>;
  export const Avatar: ComponentType<any>;
  export const AvatarImage: ComponentType<any>;
  export const AvatarFallbackText: ComponentType<any>;
  export const Progress: ComponentType<any>;
  export const ProgressFilledTrack: ComponentType<any>;
  export const Divider: ComponentType<any>;
  export const Switch: ComponentType<any>;
  export const Modal: ComponentType<any>;
  export const ModalBackdrop: ComponentType<any>;
  export const ModalContent: ComponentType<any>;
  export const ModalHeader: ComponentType<any>;
  export const ModalCloseButton: ComponentType<any>;
  export const ModalBody: ComponentType<any>;
  export const ModalFooter: ComponentType<any>;
  export const Toast: ComponentType<any>;
  export const ToastTitle: ComponentType<any>;
  export const ToastDescription: ComponentType<any>;
  export const useToast: () => any;
  export const GluestackUIProvider: ComponentType<any>;
  export const config: any;
}
