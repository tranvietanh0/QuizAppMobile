import { useWindowDimensions } from "react-native";

interface ResponsiveGridConfig {
  minItemWidth?: number;
  maxColumns?: number;
  gap?: number;
  horizontalPadding?: number;
}

interface ResponsiveGridResult {
  numColumns: number;
  itemWidth: number;
  gap: number;
}

/**
 * Calculate optimal grid column count based on screen width
 * Adapts to different screen sizes: phones, phablets, tablets
 *
 * @param config - Configuration for responsive grid
 * @returns Object with numColumns, itemWidth, and gap
 */
export function useResponsiveColumns(config: ResponsiveGridConfig = {}): ResponsiveGridResult {
  const { width } = useWindowDimensions();

  const {
    minItemWidth = 150, // Minimum width for each item
    maxColumns = 4, // Maximum columns even on large screens
    gap = 12, // Gap between items
    horizontalPadding = 16, // Container horizontal padding
  } = config;

  // Available width for grid (minus container padding)
  const availableWidth = width - horizontalPadding * 2;

  // Calculate optimal number of columns
  // Each column needs: item width + gap (except last column)
  // Available = (itemWidth * columns) + (gap * (columns - 1))
  // Rearranging: columns = (available + gap) / (minItemWidth + gap)
  const theoreticalColumns = Math.floor((availableWidth + gap) / (minItemWidth + gap));

  // Clamp between 2 and maxColumns
  const numColumns = Math.max(2, Math.min(theoreticalColumns, maxColumns));

  // Calculate actual item width based on chosen columns
  // itemWidth = (available - (gap * (columns - 1))) / columns
  const itemWidth = (availableWidth - gap * (numColumns - 1)) / numColumns;

  return {
    numColumns,
    itemWidth,
    gap,
  };
}

/**
 * Get responsive column config for common layouts
 */
export function useResponsiveCategoryGrid(): ResponsiveGridResult {
  return useResponsiveColumns({
    minItemWidth: 150,
    maxColumns: 4,
    gap: 12,
    horizontalPadding: 16,
  });
}
