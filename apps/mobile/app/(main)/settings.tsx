import { ScrollView, View, Text, StyleSheet, Switch, Alert } from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme, useColors } from "@/theme";
import { FadeIn, Card, AnimatedPressable } from "@/components/ui";

type ThemePreference = "system" | "light" | "dark";

export default function SettingsScreen() {
  const { preference, setPreference } = useTheme();
  const colors = useColors();

  const handleThemeChange = (newPreference: ThemePreference) => {
    setPreference(newPreference);
  };

  const handleNotificationToggle = (_value: boolean) => {
    // TODO: Implement notification toggle with API
    Alert.alert("Notifications", "Notification settings updated");
  };

  const handleSoundToggle = (_value: boolean) => {
    // TODO: Implement sound toggle with local storage
  };

  const handleVibrationToggle = (_value: boolean) => {
    // TODO: Implement vibration toggle with local storage
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Settings",
          headerBackTitle: "Back",
        }}
      />
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["bottom"]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Appearance Section */}
            <FadeIn delay={0}>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                  Appearance
                </Text>
                <Card variant="outlined" padding="none" radius="xl">
                  <View style={[styles.settingRow, { borderBottomColor: colors.separator }]}>
                    <View style={styles.settingLeft}>
                      <View
                        style={[styles.settingIcon, { backgroundColor: colors.primary + "15" }]}
                      >
                        <Ionicons name="sunny" size={20} color={colors.primary} />
                      </View>
                      <View>
                        <Text style={[styles.settingTitle, { color: colors.text }]}>Theme</Text>
                        <Text style={[styles.settingSubtitle, { color: colors.textTertiary }]}>
                          {preference === "system"
                            ? "Following system"
                            : preference === "dark"
                              ? "Dark mode"
                              : "Light mode"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.themeOptions}>
                    {(["system", "light", "dark"] as const).map((option) => (
                      <AnimatedPressable
                        key={option}
                        style={[
                          styles.themeOption,
                          {
                            backgroundColor:
                              preference === option
                                ? colors.primary + "15"
                                : colors.backgroundSecondary,
                            borderColor:
                              preference === option ? colors.primary : colors.backgroundSecondary,
                          },
                        ]}
                        onPress={() => handleThemeChange(option)}
                      >
                        <Ionicons
                          name={
                            option === "system"
                              ? "phone-portrait"
                              : option === "light"
                                ? "sunny"
                                : "moon"
                          }
                          size={20}
                          color={preference === option ? colors.primary : colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.themeOptionText,
                            {
                              color: preference === option ? colors.primary : colors.textSecondary,
                            },
                          ]}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </AnimatedPressable>
                    ))}
                  </View>
                </Card>
              </View>
            </FadeIn>

            {/* Sound & Haptics Section */}
            <FadeIn delay={100}>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                  Sound & Haptics
                </Text>
                <Card variant="outlined" padding="none" radius="xl">
                  <View style={[styles.settingRow, { borderBottomColor: colors.separator }]}>
                    <View style={styles.settingLeft}>
                      <View
                        style={[styles.settingIcon, { backgroundColor: colors.success + "15" }]}
                      >
                        <Ionicons name="volume-high" size={20} color={colors.success} />
                      </View>
                      <View>
                        <Text style={[styles.settingTitle, { color: colors.text }]}>Sound</Text>
                        <Text style={[styles.settingSubtitle, { color: colors.textTertiary }]}>
                          Play sounds for actions
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={true}
                      onValueChange={handleSoundToggle}
                      trackColor={{ false: colors.separator, true: colors.primary }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  <View style={styles.settingRow}>
                    <View style={styles.settingLeft}>
                      <View
                        style={[styles.settingIcon, { backgroundColor: colors.warning + "15" }]}
                      >
                        <Ionicons name="radio" size={20} color={colors.warning} />
                      </View>
                      <View>
                        <Text style={[styles.settingTitle, { color: colors.text }]}>Vibration</Text>
                        <Text style={[styles.settingSubtitle, { color: colors.textTertiary }]}>
                          Haptic feedback
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={true}
                      onValueChange={handleVibrationToggle}
                      trackColor={{ false: colors.separator, true: colors.primary }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </Card>
              </View>
            </FadeIn>

            {/* Notifications Section */}
            <FadeIn delay={200}>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                  Notifications
                </Text>
                <Card variant="outlined" padding="none" radius="xl">
                  <View style={styles.settingRow}>
                    <View style={styles.settingLeft}>
                      <View style={[styles.settingIcon, { backgroundColor: colors.error + "15" }]}>
                        <Ionicons name="notifications" size={20} color={colors.error} />
                      </View>
                      <View>
                        <Text style={[styles.settingTitle, { color: colors.text }]}>
                          Push Notifications
                        </Text>
                        <Text style={[styles.settingSubtitle, { color: colors.textTertiary }]}>
                          Daily reminders and updates
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={false}
                      onValueChange={handleNotificationToggle}
                      trackColor={{ false: colors.separator, true: colors.primary }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </Card>
              </View>
            </FadeIn>

            {/* Language Section */}
            <FadeIn delay={300}>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Language</Text>
                <Card variant="outlined" padding="none" radius="xl">
                  <AnimatedPressable
                    style={styles.settingRow}
                    onPress={() => {
                      Alert.alert("Language", "Language selection coming soon");
                    }}
                  >
                    <View style={styles.settingLeft}>
                      <View style={[styles.settingIcon, { backgroundColor: "#5856D6" + "15" }]}>
                        <Ionicons name="language" size={20} color="#5856D6" />
                      </View>
                      <View>
                        <Text style={[styles.settingTitle, { color: colors.text }]}>
                          App Language
                        </Text>
                        <Text style={[styles.settingSubtitle, { color: colors.textTertiary }]}>
                          English
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                  </AnimatedPressable>
                </Card>
              </View>
            </FadeIn>

            {/* App Info */}
            <FadeIn delay={400}>
              <View style={styles.appInfo}>
                <Text style={[styles.appVersion, { color: colors.textTertiary }]}>
                  QuizApp v1.0.0
                </Text>
                <Text style={[styles.appCopyright, { color: colors.textTertiary }]}>
                  Made with ❤️
                </Text>
              </View>
            </FadeIn>
          </View>
        </ScrollView>
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
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "transparent",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  themeOptions: {
    flexDirection: "row",
    padding: 14,
    gap: 8,
  },
  themeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  themeOptionText: {
    fontSize: 13,
    fontWeight: "600",
  },
  appInfo: {
    alignItems: "center",
    paddingVertical: 20,
  },
  appVersion: {
    fontSize: 13,
  },
  appCopyright: {
    fontSize: 12,
    marginTop: 4,
  },
});
