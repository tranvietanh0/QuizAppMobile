import { ScrollView, View, Text, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback } from "react";

import { useColors } from "@/theme";
import { FadeIn, Card } from "@/components/ui";

// Mock leaderboard data
const LEADERBOARD_DATA = [
  { rank: 1, name: "Nguyen Van A", score: 9850, avatar: "NA" },
  { rank: 2, name: "Tran Thi B", score: 9720, avatar: "TB" },
  { rank: 3, name: "Le Van C", score: 9580, avatar: "LC" },
  { rank: 4, name: "Pham Thi D", score: 9340, avatar: "PD" },
  { rank: 5, name: "Hoang Van E", score: 9100, avatar: "HE" },
  { rank: 6, name: "Vo Van F", score: 8920, avatar: "VF" },
  { rank: 7, name: "Dang Thi G", score: 8750, avatar: "DG" },
];

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

export default function LeaderboardScreen() {
  const colors = useColors();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
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
              <Text style={[styles.headerTitle, { color: colors.text }]}>Leaderboard</Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                Top players this week
              </Text>
            </View>
          </FadeIn>

          {/* Top 3 Podium */}
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
                  <Text style={styles.podiumAvatarText}>{LEADERBOARD_DATA[1]?.avatar}</Text>
                </View>
                <Text style={[styles.podiumName, { color: colors.text }]} numberOfLines={1}>
                  {LEADERBOARD_DATA[1]?.name.split(" ").pop()}
                </Text>
                <Text style={[styles.podiumScore, { color: colors.textSecondary }]}>
                  {LEADERBOARD_DATA[1]?.score.toLocaleString()}
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
                    {LEADERBOARD_DATA[0]?.avatar}
                  </Text>
                </View>
                <Text
                  style={[styles.podiumName, styles.podiumNameFirst, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {LEADERBOARD_DATA[0]?.name.split(" ").pop()}
                </Text>
                <Text style={[styles.podiumScore, { color: colors.warning }]}>
                  {LEADERBOARD_DATA[0]?.score.toLocaleString()}
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
                  <Text style={styles.podiumAvatarText}>{LEADERBOARD_DATA[2]?.avatar}</Text>
                </View>
                <Text style={[styles.podiumName, { color: colors.text }]} numberOfLines={1}>
                  {LEADERBOARD_DATA[2]?.name.split(" ").pop()}
                </Text>
                <Text style={[styles.podiumScore, { color: colors.textSecondary }]}>
                  {LEADERBOARD_DATA[2]?.score.toLocaleString()}
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

          {/* Full Leaderboard List */}
          <View style={styles.listContainer}>
            {LEADERBOARD_DATA.map((player, index) => (
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
                        {player.avatar}
                      </Text>
                    </View>
                    <View style={styles.listItemInfo}>
                      <Text style={[styles.listItemName, { color: colors.text }]}>
                        {player.name}
                      </Text>
                    </View>
                    <Text style={[styles.listItemScore, { color: colors.primary }]}>
                      {player.score.toLocaleString()}
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
