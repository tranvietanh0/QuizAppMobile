import { ScrollView, View, Text, StyleSheet, RefreshControl } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback } from "react";

import { useAuthStore } from "@/stores/auth.store";
import { useColors } from "@/theme";
import { FadeIn, AnimatedPressable, Card } from "@/components/ui";
import { useResponsiveCategoryGrid } from "@/hooks";

// Mock categories data
const CATEGORIES = [
  { id: "1", name: "Science", icon: "beaker" as const, color: "#007AFF" },
  { id: "2", name: "History", icon: "book" as const, color: "#5856D6" },
  { id: "3", name: "Geography", icon: "globe" as const, color: "#34C759" },
  { id: "4", name: "Sports", icon: "trophy" as const, color: "#FF9500" },
  { id: "5", name: "Music", icon: "musical-notes" as const, color: "#FF3B30" },
  { id: "6", name: "Movies", icon: "film" as const, color: "#AF52DE" },
];

export default function HomeScreen() {
  const { user } = useAuthStore();
  const colors = useColors();
  const [refreshing, setRefreshing] = useState(false);
  const { itemWidth, gap } = useResponsiveCategoryGrid();

  const handleStartQuiz = (categoryId: string) => {
    router.push(`/(main)/quiz/${categoryId}` as never);
  };

  const handleDailyChallenge = () => {
    router.push("/(main)/daily-challenge" as never);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.content}>
          {/* Header */}
          <FadeIn delay={0}>
            <View style={styles.header}>
              <Text style={[styles.greeting, { color: colors.textSecondary }]}>Hello,</Text>
              <Text style={[styles.username, { color: colors.text }]}>
                {user?.displayName || user?.username || "Player"}
              </Text>
            </View>
          </FadeIn>

          {/* Daily Challenge Card */}
          <FadeIn delay={100}>
            <AnimatedPressable onPress={handleDailyChallenge}>
              <View style={[styles.dailyCard, { backgroundColor: colors.primary }]}>
                <View style={styles.dailyCardContent}>
                  <View style={styles.dailyCardText}>
                    <Text style={styles.dailyCardLabel}>Daily Challenge</Text>
                    <Text style={styles.dailyCardTitle}>10 questions - 5 min</Text>
                    <Text style={styles.dailyCardSubtitle}>Complete to earn coins!</Text>
                  </View>
                  <View style={styles.dailyCardButton}>
                    <Ionicons name="play" size={24} color={colors.primary} />
                  </View>
                </View>
              </View>
            </AnimatedPressable>
          </FadeIn>

          {/* Categories Section */}
          <FadeIn delay={200}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
              <AnimatedPressable>
                <Text style={[styles.viewAllText, { color: colors.primary }]}>View all</Text>
              </AnimatedPressable>
            </View>
          </FadeIn>

          {/* Category Grid - Responsive */}
          <View style={[styles.categoryGrid, { marginHorizontal: -(gap / 2) }]}>
            {CATEGORIES.map((category, index) => (
              <FadeIn key={category.id} delay={250 + index * 50}>
                <AnimatedPressable
                  onPress={() => handleStartQuiz(category.id)}
                  style={{ width: itemWidth, padding: gap / 2 }}
                >
                  <Card variant="outlined" padding="md" radius="xl">
                    <View style={[styles.categoryIcon, { backgroundColor: category.color + "15" }]}>
                      <Ionicons name={category.icon} size={24} color={category.color} />
                    </View>
                    <Text style={[styles.categoryName, { color: colors.text }]}>
                      {category.name}
                    </Text>
                    <Text style={[styles.categoryCount, { color: colors.textTertiary }]}>
                      50 questions
                    </Text>
                  </Card>
                </AnimatedPressable>
              </FadeIn>
            ))}
          </View>

          {/* Recent Activity */}
          <FadeIn delay={550}>
            <View style={styles.recentSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
              <Card variant="outlined" padding="lg" radius="xl" style={styles.emptyCard}>
                <View style={styles.emptyState}>
                  <View style={[styles.emptyIcon, { backgroundColor: colors.backgroundSecondary }]}>
                    <Ionicons name="time-outline" size={24} color={colors.textTertiary} />
                  </View>
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    No recent activity
                  </Text>
                  <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                    Start a quiz to see your progress
                  </Text>
                </View>
              </Card>
            </View>
          </FadeIn>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
  },
  username: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 4,
  },
  dailyCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  dailyCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dailyCardText: {
    flex: 1,
  },
  dailyCardLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  dailyCardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 4,
  },
  dailyCardSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 6,
  },
  dailyCardButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
  },
  categoryCount: {
    fontSize: 12,
    marginTop: 4,
  },
  recentSection: {
    marginTop: 24,
  },
  emptyCard: {
    marginTop: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 16,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
});
