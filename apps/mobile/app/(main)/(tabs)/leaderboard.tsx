import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback } from "react";

import { useColors } from "@/theme";
import { FadeIn, Card, EmptyState } from "@/components/ui";
import { useGlobalLeaderboard, useUserRank } from "@/services";

function getRankColor(rank: number): string {
  switch (rank) {
    case 1:
      return "#FFD700"; // Gold
    case 2:
      return "#C0C0C0"; // Silver
    case 3:
      return "#CD7F32"; // Bronze
    default:
      return "#007AFF"; // Primary
  }
}

function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export default function LeaderboardScreen() {
  const colors = useColors();

  const {
    data: leaderboard,
    isLoading,
    refetch,
    isRefetching,
  } = useGlobalLeaderboard({ period: "ALL_TIME" });

  const { data: userRank } = useUserRank({ period: "ALL_TIME" });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const entries = leaderboard?.entries ?? [];
  const topThree = entries.slice(0, 3);
  const refreshing = isRefetching;

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (entries.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Leaderboard</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Top players this week
            </Text>
          </View>
          <EmptyState
            icon="trophy-outline"
            title="No Rankings Yet"
            description="Be the first to complete a quiz and claim the top spot!"
          />
        </View>
      </SafeAreaView>
    );
  }

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
              <Text style={[styles.headerTitle, { color: colors.text }]}>Leaderboard</Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                Top players this week
              </Text>
            </View>
          </FadeIn>

          {/* Top 3 Podium */}
          {topThree.length >= 3 && (
            <FadeIn delay={100}>
              <View style={styles.podium}>
                {/* 2nd Place */}
                <View style={styles.podiumItem}>
                  <View
                    style={[
                      styles.podiumAvatar,
                      styles.podiumAvatarMedium,
                      { backgroundColor: getRankColor(2) },
                    ]}
                  >
                    <Text style={styles.podiumAvatarText}>
                      {getInitials(topThree[1]?.displayName || topThree[1]?.username || "?")}
                    </Text>
                  </View>
                  <Text style={[styles.podiumName, { color: colors.text }]} numberOfLines={1}>
                    {topThree[1]?.displayName?.split(" ").pop() || topThree[1]?.username}
                  </Text>
                  <Text style={[styles.podiumScore, { color: colors.textSecondary }]}>
                    {topThree[1]?.totalScore?.toLocaleString() ?? 0}
                  </Text>
                  <View
                    style={[
                      styles.podiumBase,
                      styles.podiumBase2nd,
                      { backgroundColor: colors.backgroundSecondary },
                    ]}
                  >
                    <Text style={[styles.podiumRank, { color: colors.textSecondary }]}>2</Text>
                  </View>
                </View>

                {/* 1st Place */}
                <View style={[styles.podiumItem, styles.podiumItemFirst]}>
                  <View style={styles.crownContainer}>
                    <Text style={styles.crown}>👑</Text>
                  </View>
                  <View
                    style={[
                      styles.podiumAvatar,
                      styles.podiumAvatarLarge,
                      { backgroundColor: getRankColor(1) },
                    ]}
                  >
                    <Text style={[styles.podiumAvatarText, styles.podiumAvatarTextLarge]}>
                      {getInitials(topThree[0]?.displayName || topThree[0]?.username || "?")}
                    </Text>
                  </View>
                  <Text
                    style={[styles.podiumName, styles.podiumNameFirst, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {topThree[0]?.displayName?.split(" ").pop() || topThree[0]?.username}
                  </Text>
                  <Text style={[styles.podiumScore, { color: colors.warning }]}>
                    {topThree[0]?.totalScore?.toLocaleString() ?? 0}
                  </Text>
                  <View
                    style={[
                      styles.podiumBase,
                      styles.podiumBase1st,
                      { backgroundColor: colors.warning + "20" },
                    ]}
                  >
                    <Text style={[styles.podiumRank, { color: colors.warning }]}>1</Text>
                  </View>
                </View>

                {/* 3rd Place */}
                <View style={styles.podiumItem}>
                  <View
                    style={[
                      styles.podiumAvatar,
                      styles.podiumAvatarMedium,
                      { backgroundColor: getRankColor(3) },
                    ]}
                  >
                    <Text style={styles.podiumAvatarText}>
                      {getInitials(topThree[2]?.displayName || topThree[2]?.username || "?")}
                    </Text>
                  </View>
                  <Text style={[styles.podiumName, { color: colors.text }]} numberOfLines={1}>
                    {topThree[2]?.displayName?.split(" ").pop() || topThree[2]?.username}
                  </Text>
                  <Text style={[styles.podiumScore, { color: colors.textSecondary }]}>
                    {topThree[2]?.totalScore?.toLocaleString() ?? 0}
                  </Text>
                  <View
                    style={[
                      styles.podiumBase,
                      styles.podiumBase3rd,
                      { backgroundColor: "#CD7F32" + "20" },
                    ]}
                  >
                    <Text style={[styles.podiumRank, { color: "#CD7F32" }]}>3</Text>
                  </View>
                </View>
              </View>
            </FadeIn>
          )}

          {/* User's Current Rank */}
          {userRank?.entry && (
            <FadeIn delay={150}>
              <Card variant="filled" padding="md" radius="xl" style={styles.userRankCard}>
                <View style={styles.listItemContent}>
                  <View style={[styles.rankBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.rankBadgeText}>{userRank.entry.rank}</Text>
                  </View>
                  <View style={[styles.listAvatar, { backgroundColor: colors.primary + "20" }]}>
                    <Text style={[styles.listAvatarText, { color: colors.primary }]}>
                      {getInitials(userRank.entry.displayName || userRank.entry.username || "?")}
                    </Text>
                  </View>
                  <View style={styles.listItemInfo}>
                    <Text style={[styles.listItemName, { color: colors.text }]}>You</Text>
                  </View>
                  <Text style={[styles.listItemScore, { color: colors.primary }]}>
                    {userRank.entry.totalScore?.toLocaleString() ?? 0}
                  </Text>
                </View>
              </Card>
            </FadeIn>
          )}

          {/* Full Leaderboard List */}
          <View style={styles.listContainer}>
            {entries.map((player, index) => (
              <FadeIn key={player.rank} delay={200 + index * 50}>
                <Card variant="outlined" padding="md" radius="xl" style={styles.listItem}>
                  <View style={styles.listItemContent}>
                    <View
                      style={[styles.rankBadge, { backgroundColor: getRankColor(player.rank) }]}
                    >
                      <Text style={styles.rankBadgeText}>{player.rank}</Text>
                    </View>
                    <View style={[styles.listAvatar, { backgroundColor: colors.primary + "20" }]}>
                      <Text style={[styles.listAvatarText, { color: colors.primary }]}>
                        {getInitials(player.displayName || player.username || "?")}
                      </Text>
                    </View>
                    <View style={styles.listItemInfo}>
                      <Text style={[styles.listItemName, { color: colors.text }]}>
                        {player.displayName || player.username}
                      </Text>
                    </View>
                    <Text style={[styles.listItemScore, { color: colors.primary }]}>
                      {player.totalScore?.toLocaleString() ?? 0}
                    </Text>
                  </View>
                </Card>
              </FadeIn>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingVertical: 24,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  podium: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  podiumItem: {
    flex: 1,
    alignItems: "center",
  },
  podiumItemFirst: {
    marginHorizontal: 8,
  },
  crownContainer: {
    marginBottom: 4,
  },
  crown: {
    fontSize: 24,
  },
  podiumAvatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  podiumAvatarMedium: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  podiumAvatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  podiumAvatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  podiumAvatarTextLarge: {
    fontSize: 22,
  },
  podiumName: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  podiumNameFirst: {
    fontSize: 16,
  },
  podiumScore: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  podiumBase: {
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  podiumBase1st: {
    height: 80,
  },
  podiumBase2nd: {
    height: 64,
  },
  podiumBase3rd: {
    height: 48,
  },
  podiumRank: {
    fontSize: 28,
    fontWeight: "700",
  },
  userRankCard: {
    marginBottom: 16,
  },
  listContainer: {
    gap: 8,
  },
  listItem: {
    marginBottom: 0,
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  rankBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  listAvatarText: {
    fontSize: 14,
    fontWeight: "600",
  },
  listItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: "600",
  },
  listItemScore: {
    fontSize: 16,
    fontWeight: "700",
  },
});
