import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColors } from "@/theme";
import { FadeIn, Card } from "@/components/ui";

export default function AchievementsScreen() {
  const colors = useColors();

  // Placeholder achievements - will be replaced with real API
  const placeholderAchievements = [
    {
      id: "1",
      name: "First Steps",
      description: "Complete your first quiz",
      icon: "star",
      unlocked: true,
    },
    {
      id: "2",
      name: "Streak Master",
      description: "Maintain a 7-day streak",
      icon: "flame",
      unlocked: false,
    },
    {
      id: "3",
      name: "Perfect Score",
      description: "Get 100% on any quiz",
      icon: "trophy",
      unlocked: false,
    },
    {
      id: "4",
      name: "Knowledge Seeker",
      description: "Complete 10 quizzes",
      icon: "book",
      unlocked: false,
    },
    {
      id: "5",
      name: "Speed Demon",
      description: "Complete a quiz in under 60 seconds",
      icon: "flash",
      unlocked: false,
    },
    {
      id: "6",
      name: "Well Rounded",
      description: "Complete a quiz in every category",
      icon: "globe",
      unlocked: false,
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Achievements",
          headerBackTitle: "Back",
        }}
      />
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["bottom"]}
      >
        <View style={styles.content}>
          {/* Coming Soon Banner */}
          <FadeIn delay={0}>
            <Card variant="filled" padding="lg" radius="xl" style={styles.comingSoonCard}>
              <View style={styles.comingSoonContent}>
                <View style={[styles.comingSoonIcon, { backgroundColor: colors.warning + "20" }]}>
                  <Ionicons name="construct" size={28} color={colors.warning} />
                </View>
                <Text style={[styles.comingSoonTitle, { color: colors.text }]}>Coming Soon!</Text>
                <Text style={[styles.comingSoonText, { color: colors.textSecondary }]}>
                  We're working on an exciting achievements system. Stay tuned!
                </Text>
              </View>
            </Card>
          </FadeIn>

          {/* Achievement Preview */}
          <FadeIn delay={100}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              Preview of Achievements
            </Text>
          </FadeIn>

          <View style={styles.achievementsList}>
            {placeholderAchievements.map((achievement, index) => (
              <FadeIn key={achievement.id} delay={150 + index * 50}>
                <Card
                  variant="outlined"
                  padding="md"
                  radius="xl"
                  style={[styles.achievementCard, !achievement.unlocked && styles.lockedCard]}
                >
                  <View style={styles.achievementRow}>
                    <View
                      style={[
                        styles.achievementIcon,
                        {
                          backgroundColor: achievement.unlocked
                            ? colors.warning + "20"
                            : colors.backgroundSecondary,
                        },
                      ]}
                    >
                      <Ionicons
                        name={achievement.icon as keyof typeof Ionicons.glyphMap}
                        size={24}
                        color={achievement.unlocked ? colors.warning : colors.textTertiary}
                      />
                    </View>
                    <View style={styles.achievementInfo}>
                      <Text
                        style={[
                          styles.achievementName,
                          { color: achievement.unlocked ? colors.text : colors.textTertiary },
                        ]}
                      >
                        {achievement.name}
                      </Text>
                      <Text style={[styles.achievementDescription, { color: colors.textTertiary }]}>
                        {achievement.description}
                      </Text>
                    </View>
                    {achievement.unlocked ? (
                      <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                    ) : (
                      <Ionicons name="lock-closed" size={20} color={colors.textTertiary} />
                    )}
                  </View>
                </Card>
              </FadeIn>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flex: 1,
  },
  comingSoonCard: {
    marginBottom: 24,
  },
  comingSoonContent: {
    alignItems: "center",
    paddingVertical: 8,
  },
  comingSoonIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  achievementsList: {
    gap: 10,
  },
  achievementCard: {
    marginBottom: 0,
  },
  lockedCard: {
    opacity: 0.7,
  },
  achievementRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  achievementInfo: {
    flex: 1,
    marginLeft: 12,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: "600",
  },
  achievementDescription: {
    fontSize: 13,
    marginTop: 2,
  },
});
