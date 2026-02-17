import { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColors } from "@/theme";
import { FadeIn, AnimatedPressable, Card, EmptyState } from "@/components/ui";
import { useQuizHistory, SessionSummary } from "@/services";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

function getAccuracyColor(accuracy: number, colors: ReturnType<typeof useColors>): string {
  if (accuracy >= 80) return colors.success;
  if (accuracy >= 50) return colors.warning;
  return colors.error;
}

export default function HistoryScreen() {
  const colors = useColors();
  const [page, setPage] = useState(1);

  const { data: historyData, isLoading, refetch, isRefetching } = useQuizHistory(page);

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const sessions = historyData?.data ?? [];
  const refreshing = isRefetching;

  if (isLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: "Quiz History",
            headerBackTitle: "Back",
          }}
        />
        <SafeAreaView
          style={[styles.container, { backgroundColor: colors.background }]}
          edges={["bottom"]}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Quiz History",
          headerBackTitle: "Back",
        }}
      />
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["bottom"]}
      >
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
            {sessions.length === 0 ? (
              <EmptyState
                icon="time-outline"
                title="No Quiz History"
                description="Complete your first quiz to see your history here"
              />
            ) : (
              <View style={styles.listContainer}>
                {sessions.map((session, index) => (
                  <HistoryItem
                    key={session.id}
                    session={session}
                    colors={colors}
                    delay={index * 50}
                  />
                ))}
              </View>
            )}

            {historyData?.meta?.hasNextPage && (
              <AnimatedPressable
                onPress={() => setPage((p) => p + 1)}
                style={[styles.loadMoreButton, { borderColor: colors.cardBorder }]}
              >
                <Text style={[styles.loadMoreText, { color: colors.primary }]}>Load More</Text>
              </AnimatedPressable>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

interface HistoryItemProps {
  session: SessionSummary;
  colors: ReturnType<typeof useColors>;
  delay: number;
}

function HistoryItem({ session, colors, delay }: HistoryItemProps) {
  const accuracy = Math.round((session.correctAnswers / session.totalQuestions) * 100);
  const accuracyColor = getAccuracyColor(accuracy, colors);

  return (
    <FadeIn delay={delay}>
      <Card variant="outlined" padding="md" radius="xl" style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: colors.primary + "15" }]}>
            <Ionicons name="book" size={16} color={colors.primary} />
          </View>
          <View style={styles.historyInfo}>
            <Text style={[styles.categoryName, { color: colors.text }]}>
              {session.categoryName}
            </Text>
            <Text style={[styles.dateText, { color: colors.textTertiary }]}>
              {formatDate(session.startedAt)}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  session.status === "COMPLETED" ? colors.success + "15" : colors.warning + "15",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: session.status === "COMPLETED" ? colors.success : colors.warning },
              ]}
            >
              {session.status === "COMPLETED" ? "Completed" : "Abandoned"}
            </Text>
          </View>
        </View>

        <View style={styles.historyStats}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{session.score}</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Score</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {session.correctAnswers}/{session.totalQuestions}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Correct</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: accuracyColor }]}>{accuracy}%</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Accuracy</Text>
          </View>
        </View>
      </Card>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  listContainer: {
    gap: 12,
  },
  historyCard: {
    marginBottom: 0,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  historyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
  },
  dateText: {
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  historyStats: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  loadMoreButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
