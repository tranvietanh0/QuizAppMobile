/**
 * ProgressRing - Circular progress indicator
 * Used for quiz results and statistics
 */
import React, { useEffect } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import { useColors } from "@/theme";
import { progress as progressConfig, easing } from "@/theme/animations";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  /** Progress value (0-100) */
  progress: number;
  /** Size of the ring */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Color of the progress stroke */
  progressColor?: string;
  /** Color of the background ring */
  backgroundColor?: string;
  /** Whether to animate the progress */
  animated?: boolean;
  /** Animation duration in ms */
  duration?: number;
  /** Center content */
  children?: React.ReactNode;
  /** Custom style */
  style?: ViewStyle;
}

/**
 * Circular progress indicator with optional animation
 */
export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 10,
  progressColor,
  backgroundColor,
  animated = true,
  duration = progressConfig.circleDuration,
  children,
  style,
}: ProgressRingProps) {
  const colors = useColors();
  const animatedProgress = useSharedValue(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  useEffect(() => {
    if (animated) {
      animatedProgress.value = withTiming(progress, {
        duration,
        easing: easing.easeOut,
      });
    } else {
      animatedProgress.value = progress;
    }
  }, [progress, animated, duration, animatedProgress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = interpolate(animatedProgress.value, [0, 100], [circumference, 0]);
    return {
      strokeDashoffset,
    };
  });

  const bgColor = backgroundColor || colors.separator;
  const fgColor = progressColor || colors.primary;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={fgColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      {/* Center Content */}
      {children && <View style={styles.centerContent}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  svg: {
    position: "absolute",
  },
  centerContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProgressRing;
