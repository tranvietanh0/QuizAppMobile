/**
 * AnimatedPressable - Apple-style press animation component
 * Provides subtle scale and opacity feedback on press
 */
import React, { useCallback } from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
} from "react-native-reanimated";

import { press, easing } from "@/theme/animations";

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableProps extends Omit<PressableProps, "style"> {
  /** Custom style for the pressable */
  style?: StyleProp<ViewStyle>;
  /** Scale amount when pressed (default: 0.97) */
  pressScale?: number;
  /** Opacity when pressed (default: 0.8) */
  pressOpacity?: number;
  /** Whether to disable the animation */
  disableAnimation?: boolean;
  children: React.ReactNode;
}

/**
 * A pressable component with Apple-style press animation
 * Subtle scale down (0.97) and reduced opacity on press
 */
export function AnimatedPressable({
  style,
  pressScale = press.scale,
  pressOpacity = press.opacity,
  disableAnimation = false,
  onPressIn,
  onPressOut,
  disabled,
  children,
  ...props
}: AnimatedPressableProps) {
  const pressed = useSharedValue(0);

  const handlePressIn = useCallback(
    (e: Parameters<NonNullable<PressableProps["onPressIn"]>>[0]) => {
      if (!disableAnimation && !disabled) {
        pressed.value = withTiming(1, {
          duration: press.pressDownDuration,
          easing: easing.easeOut,
        });
      }
      onPressIn?.(e);
    },
    [disableAnimation, disabled, onPressIn, pressed]
  );

  const handlePressOut = useCallback(
    (e: Parameters<NonNullable<PressableProps["onPressOut"]>>[0]) => {
      pressed.value = withTiming(0, {
        duration: press.releaseDuration,
        easing: easing.easeOut,
      });
      onPressOut?.(e);
    },
    [onPressOut, pressed]
  );

  const animatedStyle = useAnimatedStyle(() => {
    if (disableAnimation) {
      return {};
    }

    const scale = interpolate(pressed.value, [0, 1], [1, pressScale]);
    const opacity = interpolate(pressed.value, [0, 1], [1, pressOpacity]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <AnimatedPressableBase
      style={[style, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      {...props}
    >
      {children}
    </AnimatedPressableBase>
  );
}

export default AnimatedPressable;
