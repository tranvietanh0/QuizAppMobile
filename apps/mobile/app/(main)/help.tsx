import { useState } from "react";
import { ScrollView, View, Text, StyleSheet, Linking } from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColors } from "@/theme";
import { FadeIn, Card, AnimatedPressable, ListItem } from "@/components/ui";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How do I start a quiz?",
    answer:
      "From the home screen, tap on any category card to start a quiz. You can choose the difficulty level and number of questions before starting.",
  },
  {
    question: "What is the Daily Challenge?",
    answer:
      "The Daily Challenge is a special quiz that refreshes every day. Complete it to earn bonus points and build your streak!",
  },
  {
    question: "How does the streak system work?",
    answer:
      "Your streak increases each day you complete the Daily Challenge. The longer your streak, the higher your bonus multiplier for points.",
  },
  {
    question: "How are points calculated?",
    answer:
      "Points are based on correct answers, time taken, and your current streak multiplier. Faster correct answers earn more points.",
  },
  {
    question: "Can I play offline?",
    answer:
      "Currently, QuizApp requires an internet connection to load questions and save your progress. Offline mode is coming soon!",
  },
  {
    question: "How do I change my profile information?",
    answer: "Go to Profile > Settings to update your display name and other account information.",
  },
];

export default function HelpScreen() {
  const colors = useColors();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleEmailSupport = () => {
    Linking.openURL("mailto:support@quizapp.com?subject=QuizApp Support Request");
  };

  const handlePrivacyPolicy = () => {
    // TODO: Replace with actual privacy policy URL
    Linking.openURL("https://quizapp.com/privacy");
  };

  const handleTermsOfService = () => {
    // TODO: Replace with actual terms of service URL
    Linking.openURL("https://quizapp.com/terms");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Help & Support",
          headerBackTitle: "Back",
        }}
      />
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["bottom"]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* FAQ Section */}
            <FadeIn delay={0}>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                  Frequently Asked Questions
                </Text>
                <Card variant="outlined" padding="none" radius="xl">
                  {FAQ_ITEMS.map((item, index) => (
                    <FAQItemRow
                      key={index}
                      item={item}
                      isExpanded={expandedIndex === index}
                      isLast={index === FAQ_ITEMS.length - 1}
                      onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}
                      colors={colors}
                    />
                  ))}
                </Card>
              </View>
            </FadeIn>

            {/* Contact Section */}
            <FadeIn delay={100}>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                  Contact Us
                </Text>
                <View style={styles.contactList}>
                  <ListItem
                    title="Email Support"
                    subtitle="support@quizapp.com"
                    leftIcon="mail-outline"
                    leftIconBg={colors.primary}
                    onPress={handleEmailSupport}
                  />
                </View>
              </View>
            </FadeIn>

            {/* Legal Section */}
            <FadeIn delay={200}>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Legal</Text>
                <View style={styles.contactList}>
                  <ListItem
                    title="Privacy Policy"
                    leftIcon="shield-checkmark-outline"
                    onPress={handlePrivacyPolicy}
                  />
                  <ListItem
                    title="Terms of Service"
                    leftIcon="document-text-outline"
                    onPress={handleTermsOfService}
                  />
                </View>
              </View>
            </FadeIn>

            {/* App Info */}
            <FadeIn delay={300}>
              <View style={styles.appInfo}>
                <View style={[styles.appIcon, { backgroundColor: colors.primary }]}>
                  <Text style={styles.appIconText}>Q</Text>
                </View>
                <Text style={[styles.appName, { color: colors.text }]}>QuizApp</Text>
                <Text style={[styles.appVersion, { color: colors.textTertiary }]}>
                  Version 1.0.0
                </Text>
                <Text style={[styles.appCopyright, { color: colors.textTertiary }]}>
                  © 2024 QuizApp. All rights reserved.
                </Text>
              </View>
            </FadeIn>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

interface FAQItemRowProps {
  item: FAQItem;
  isExpanded: boolean;
  isLast: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}

function FAQItemRow({ item, isExpanded, isLast, onPress, colors }: FAQItemRowProps) {
  return (
    <AnimatedPressable
      onPress={onPress}
      style={[
        styles.faqRow,
        !isLast && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.separator,
        },
      ]}
    >
      <View style={styles.faqHeader}>
        <Text style={[styles.faqQuestion, { color: colors.text }]}>{item.question}</Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.textTertiary}
        />
      </View>
      {isExpanded && (
        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{item.answer}</Text>
      )}
    </AnimatedPressable>
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
  faqRow: {
    padding: 14,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
    paddingRight: 12,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  contactList: {
    gap: 8,
  },
  appInfo: {
    alignItems: "center",
    paddingVertical: 24,
  },
  appIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  appIconText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  appName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
  },
});
