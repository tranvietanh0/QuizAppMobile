/**
 * Animation constants following Apple Human Interface Guidelines
 * Subtle, professional animations with no excessive motion
 */
import { Easing } from "react-native-reanimated";

/**
 * Duration constants in milliseconds
 */
export const timing = {
  /** Quick interactions like button presses */
  fast: 150,
  /** Standard transitions */
  normal: 300,
  /** Deliberate, emphasized transitions */
  slow: 500,
  /** Screen transitions */
  transition: 350,
} as const;

/**
 * iOS-like easing curves
 */
export const easing = {
  /** Standard exit curve - fast start, slow end */
  easeOut: Easing.bezier(0, 0, 0.2, 1),
  /** Entry curve - slow start, fast end */
  easeIn: Easing.bezier(0.4, 0, 1, 1),
  /** Symmetric curve for reversible animations */
  easeInOut: Easing.bezier(0.4, 0, 0.2, 1),
  /** iOS system curve */
  ios: Easing.bezier(0.25, 0.1, 0.25, 1),
} as const;

/**
 * Spring configurations - subtle, not bouncy
 */
export const spring = {
  /** Gentle spring for most UI elements */
  gentle: {
    damping: 20,
    stiffness: 300,
    mass: 1,
  },
  /** Quick spring for small elements */
  quick: {
    damping: 25,
    stiffness: 400,
    mass: 0.8,
  },
  /** Soft spring for larger elements */
  soft: {
    damping: 15,
    stiffness: 200,
    mass: 1,
  },
} as const;

/**
 * Press animation values
 */
export const press = {
  /** Scale when pressed */
  scale: 0.97,
  /** Opacity when pressed */
  opacity: 0.8,
  /** Press down duration */
  pressDownDuration: 100,
  /** Release duration */
  releaseDuration: 200,
} as const;

/**
 * Entrance animation values
 */
export const entrance = {
  /** Fade in values */
  fade: {
    duration: 300,
    initialOpacity: 0,
  },
  /** Slide up values */
  slideUp: {
    duration: 300,
    distance: 8,
  },
  /** Slide from right values */
  slideRight: {
    duration: 350,
    distance: 20,
  },
  /** Stagger delay between items */
  staggerDelay: 80,
} as const;

/**
 * Counter animation for numbers
 */
export const counter = {
  /** Duration for counting animation */
  duration: 1500,
  /** Steps per second */
  fps: 60,
} as const;

/**
 * Progress animation
 */
export const progress = {
  /** Fill duration */
  duration: 300,
  /** Circle stroke animation duration */
  circleDuration: 1500,
} as const;
