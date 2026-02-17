/**
 * Skeleton - Loading placeholder with shimmer animation
 * Used to indicate loading state in a more elegant way than spinners
 */
import React, { useEffect } from "react";
import { View, StyleSheet, ViewStyle, DimensionValue } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { useColors, useIsDark } from "@/theme";

interface SkeletonProps {
  /** Width of the skeleton */
  width?: DimensionValue;
  /** Height of the skeleton */
  height?: DimensionValue;
  /** Border radius */
  borderRadius?: number;
  /** Whether to show shimmer animation */
  shimmer?: boolean;
  /** Custom style */
  style?: ViewStyle;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

/**
 * Skeleton loading placeholder with shimmer effect
 */
export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 8,
  shimmer = true,
  style,
}: SkeletonProps) {
  const isDark = useIsDark();
  const shimmerProgress = useSharedValue(0);

  const baseColor = isDark ? "#2C2C2E" : "#E5E5EA";
  const highlightColor = isDark ? "#3C3C3E" : "#F2F2F7";

  useEffect(() => {
    if (shimmer) {
      shimmerProgress.value = withRepeat(
        withTiming(1, { duration: 1200 }),
        -1, // infinite
        false // no reverse
      );
    }
  }, [shimmer, shimmerProgress]);

  const animatedStyle = useAnimatedStyle(() => {
    if (!shimmer) return {};

    const translateX = interpolate(shimmerProgress.value, [0, 1], [-200, 200]);

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
          backgroundColor: baseColor,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {shimmer && (
        <AnimatedLinearGradient
          colors={[baseColor, highlightColor, baseColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.shimmer, animatedStyle]}
        />
      )}
    </View>
  );
}

/**
 * Skeleton for text lines
 */
export function SkeletonText({
  lines = 3,
  lineHeight = 16,
  spacing = 8,
  lastLineWidth = "60%",
  style,
}: {
  lines?: number;
  lineHeight?: number;
  spacing?: number;
  lastLineWidth?: DimensionValue;
  style?: ViewStyle;
}) {
  return (
    <View style={style}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? lastLineWidth : "100%"}
          height={lineHeight}
          style={{ marginBottom: index < lines - 1 ? spacing : 0 }}
        />
      ))}
    </View>
  );
}

/**
 * Skeleton for a card
 */
export function SkeletonCard({ style }: { style?: ViewStyle }) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
        style,
      ]}
    >
      <View style={styles.cardHeader}>
        <Skeleton width={48} height={48} borderRadius={12} />
        <View style={styles.cardHeaderText}>
          <Skeleton width="60%" height={18} />
          <Skeleton width="40%" height={14} style={{ marginTop: 8 }} />
        </View>
      </View>
      <SkeletonText lines={2} style={{ marginTop: 16 }} />
    </View>
  );
}

/**
 * Skeleton for list items
 */
export function SkeletonListItem({ count = 3 }: { count?: number }) {
  const colors = useColors();

  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.listItem,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Skeleton width={40} height={40} borderRadius={10} />
          <View style={styles.listItemText}>
            <Skeleton width="70%" height={16} />
            <Skeleton width="50%" height={14} style={{ marginTop: 6 }} />
          </View>
          <Skeleton width={20} height={20} borderRadius={10} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    width: 200,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  listItemText: {
    flex: 1,
    marginLeft: 12,
  },
});

export default Skeleton;
