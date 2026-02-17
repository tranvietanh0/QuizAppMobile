/**
 * CountingNumber - Animated number counter
 * Smoothly animates from 0 to target value
 */
import React, { useEffect } from "react";
import { Text, TextStyle, StyleProp } from "react-native";
import { useSharedValue, withTiming, useAnimatedReaction, runOnJS } from "react-native-reanimated";

import { counter, easing } from "@/theme/animations";

interface CountingNumberProps {
  /** Target value to count to */
  value: number;
  /** Duration of the animation in ms */
  duration?: number;
  /** Number of decimal places */
  decimals?: number;
  /** Prefix (e.g., "$", "+") */
  prefix?: string;
  /** Suffix (e.g., "%", "pts") */
  suffix?: string;
  /** Text style */
  style?: StyleProp<TextStyle>;
  /** Format function for custom formatting */
  formatValue?: (value: number) => string;
  /** Whether to animate */
  animated?: boolean;
}

/**
 * Animated number that counts up to target value
 */
export function CountingNumber({
  value,
  duration = counter.duration,
  decimals = 0,
  prefix = "",
  suffix = "",
  style,
  formatValue,
  animated = true,
}: CountingNumberProps) {
  const [displayValue, setDisplayValue] = React.useState(animated ? 0 : value);
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      animatedValue.value = withTiming(value, {
        duration,
        easing: easing.easeOut,
      });
    } else {
      animatedValue.value = value;
      setDisplayValue(value);
    }
  }, [value, animated, duration, animatedValue]);

  // Update display value on UI thread changes
  useAnimatedReaction(
    () => animatedValue.value,
    (currentValue) => {
      runOnJS(setDisplayValue)(currentValue);
    }
  );

  const formattedValue = formatValue ? formatValue(displayValue) : displayValue.toFixed(decimals);

  return (
    <Text style={style}>
      {prefix}
      {formattedValue}
      {suffix}
    </Text>
  );
}

/**
 * Simple integer counter (no decimals)
 */
export function CountingInteger(props: Omit<CountingNumberProps, "decimals" | "formatValue">) {
  return (
    <CountingNumber {...props} decimals={0} formatValue={(val) => Math.round(val).toString()} />
  );
}

/**
 * Percentage counter with % suffix
 */
export function CountingPercentage(props: Omit<CountingNumberProps, "suffix" | "decimals">) {
  return (
    <CountingNumber
      {...props}
      suffix="%"
      decimals={0}
      formatValue={(val) => Math.round(val).toString()}
    />
  );
}

export default CountingNumber;
