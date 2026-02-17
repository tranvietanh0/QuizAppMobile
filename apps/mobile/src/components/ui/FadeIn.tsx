/**
 * FadeIn - Animated entrance component
 * Provides subtle fade + slide up animation for content
 */
import React, { useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  interpolate,
} from "react-native-reanimated";

import { entrance, easing } from "@/theme/animations";

interface FadeInProps {
  /** Child elements to animate */
  children: React.ReactNode;
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Animation duration (ms) */
  duration?: number;
  /** Vertical slide distance (px) */
  slideDistance?: number;
  /** Direction of slide: 'up', 'down', 'left', 'right' */
  direction?: "up" | "down" | "left" | "right";
  /** Custom style */
  style?: StyleProp<ViewStyle>;
  /** Whether to animate on mount (default: true) */
  animateOnMount?: boolean;
  /** Trigger animation when this value changes */
  trigger?: unknown;
}

/**
 * Animated container that fades in children with optional slide
 */
export function FadeIn({
  children,
  delay = 0,
  duration = entrance.fade.duration,
  slideDistance = entrance.slideUp.distance,
  direction = "up",
  style,
  animateOnMount = true,
  trigger,
}: FadeInProps) {
  const progress = useSharedValue(animateOnMount ? 0 : 1);

  useEffect(() => {
    if (animateOnMount || trigger !== undefined) {
      progress.value = 0;
      progress.value = withDelay(
        delay,
        withTiming(1, {
          duration,
          easing: easing.easeOut,
        })
      );
    }
  }, [animateOnMount, delay, duration, progress, trigger]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1], [0, 1]);

    let translateX = 0;
    let translateY = 0;

    switch (direction) {
      case "up":
        translateY = interpolate(progress.value, [0, 1], [slideDistance, 0]);
        break;
      case "down":
        translateY = interpolate(progress.value, [0, 1], [-slideDistance, 0]);
        break;
      case "left":
        translateX = interpolate(progress.value, [0, 1], [slideDistance, 0]);
        break;
      case "right":
        translateX = interpolate(progress.value, [0, 1], [-slideDistance, 0]);
        break;
    }

    return {
      opacity,
      transform: [{ translateX }, { translateY }],
    };
  });

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

/**
 * Props for FadeInGroup items
 */
interface FadeInGroupProps {
  /** Child elements to stagger animate */
  children: React.ReactNode[];
  /** Delay between each item (ms) */
  staggerDelay?: number;
  /** Initial delay before first item (ms) */
  initialDelay?: number;
  /** Animation duration for each item (ms) */
  duration?: number;
  /** Custom style for container */
  style?: StyleProp<ViewStyle>;
}

/**
 * Animated container that staggers fade-in of children
 */
export function FadeInGroup({
  children,
  staggerDelay = entrance.staggerDelay,
  initialDelay = 0,
  duration = entrance.fade.duration,
  style,
}: FadeInGroupProps) {
  return (
    <Animated.View style={style}>
      {React.Children.map(children, (child, index) => (
        <FadeIn delay={initialDelay + index * staggerDelay} duration={duration}>
          {child}
        </FadeIn>
      ))}
    </Animated.View>
  );
}

export default FadeIn;
