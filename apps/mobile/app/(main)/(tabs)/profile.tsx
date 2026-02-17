import { ScrollView, View, Text, StyleSheet, Alert, Switch } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "@/stores/auth.store";
import { useTheme, useColors } from "@/theme";
import { FadeIn, AnimatedPressable, Card, ListItem } from "@/components/ui";
import { useUserStats, useUserStreak, computeProfileStats } from "@/services";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme, preference } = useTheme();
  const colors = useColors();

  const { data: userStats, isLoading: statsLoading } = useUserStats();
  const { data: streakData } = useUserStreak();

  // Compute profile stats from real data
  const profileStats = computeProfileStats(userStats);
  const stats = [
    { label: "Quizzes", value: statsLoading ? "-" : profileStats.quizzes },
    { label: "Accuracy", value: statsLoading ? "-" : profileStats.accuracy },
    { label: "Streak", value: String(streakData?.currentStreak ?? 0) },
  ];

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleMenuPress = (itemId: string) => {
    switch (itemId) {
      case "achievements":
        router.push("/(main)/achievements" as never);
        break;
      case "history":
        router.push("/(main)/history" as never);
        break;
      case "settings":
        router.push("/(main)/settings" as never);
        break;
      case "help":
        router.push("/(main)/help" as never);
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <FadeIn delay={0}>
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
              <AnimatedPressable
                style={[styles.settingsButton, { backgroundColor: colors.backgroundSecondary }]}
                onPress={() => handleMenuPress("settings")}
              >
                <Ionicons name="settings-outline" size={22} color={colors.text} />
              </AnimatedPressable>
            </View>
          </FadeIn>

          {/* Profile Card */}
          <FadeIn delay={100}>
            <View style={[styles.profileCard, { backgroundColor: colors.primary }]}>
              <View style={styles.profileCardContent}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>
                    {user?.displayName?.charAt(0) || user?.username?.charAt(0) || "U"}
                  </Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>
                    {user?.displayName || user?.username || "User"}
                  </Text>
                  <Text style={styles.profileEmail}>{user?.email || "email@example.com"}</Text>
                </View>
              </View>

              {/* Stats */}
              <View style={styles.statsRow}>
                {stats.map((stat, index) => (
                  <View key={index} style={styles.statItem}>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </FadeIn>

          {/* Theme Toggle */}
          <FadeIn delay={200}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
              <Card variant="outlined" padding="none" radius="xl">
                <View style={[styles.themeToggleRow, { borderBottomColor: colors.separator }]}>
                  <View style={styles.themeToggleLeft}>
                    <View style={[styles.themeIcon, { backgroundColor: colors.primary + "15" }]}>
                      <Ionicons name={isDark ? "moon" : "sunny"} size={20} color={colors.primary} />
                    </View>
                    <View>
                      <Text style={[styles.themeToggleTitle, { color: colors.text }]}>
                        Dark Mode
                      </Text>
                      <Text style={[styles.themeToggleSubtitle, { color: colors.textTertiary }]}>
                        {preference === "system" ? "Following system" : isDark ? "On" : "Off"}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={isDark}
                    onValueChange={toggleTheme}
                    trackColor={{
                      false: colors.separator,
                      true: colors.primary,
                    }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </Card>
            </View>
          </FadeIn>

          {/* Menu Items */}
          <FadeIn delay={300}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
              <View style={styles.menuList}>
                <ListItem
                  title="Achievements"
                  leftIcon="trophy-outline"
                  onPress={() => handleMenuPress("achievements")}
                />
                <ListItem
                  title="History"
                  leftIcon="time-outline"
                  onPress={() => handleMenuPress("history")}
                />
                <ListItem
                  title="Settings"
                  leftIcon="settings-outline"
                  onPress={() => handleMenuPress("settings")}
                />
                <ListItem
                  title="Help"
                  leftIcon="help-circle-outline"
                  onPress={() => handleMenuPress("help")}
                />
              </View>
            </View>
          </FadeIn>

          {/* Logout Button */}
          <FadeIn delay={400}>
            <View style={styles.section}>
              <ListItem
                title="Sign Out"
                leftIcon="log-out-outline"
                leftIconBg={colors.error}
                showChevron={false}
                variant="danger"
                onPress={handleLogout}
              />
            </View>
          </FadeIn>

          {/* App Version */}
          <FadeIn delay={500}>
            <View style={styles.versionContainer}>
              <Text style={[styles.versionText, { color: colors.textTertiary }]}>
                Version 1.0.0
              </Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  profileCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  profileCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#007AFF",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  profileEmail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  themeToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  themeToggleLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  themeIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  themeToggleTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  themeToggleSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  menuList: {
    gap: 8,
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  versionText: {
    fontSize: 12,
  },
});
