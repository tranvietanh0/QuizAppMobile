#!/usr/bin/env node
/* global require, process, console */
/* eslint-disable @typescript-eslint/no-require-imports, no-console */
/**
 * Postinstall script to patch expo-modules-autolinking for monorepo compatibility.
 *
 * This patches the autolinking_implementation.gradle to skip the
 * 'com.facebook.react.rootproject' plugin which causes conflicts in monorepos
 * when both Expo autolinking and React Native gradle plugins are used.
 */

const fs = require("fs");
const path = require("path");

const PATCH_TARGET =
  "node_modules/expo-modules-autolinking/scripts/android/autolinking_implementation.gradle";

// The exact line to find and replace
const ORIGINAL_LINE = "project.plugins.apply(modulePlugin.id)";
// Skip plugins that cause conflicts in monorepos:
// - com.facebook.react.rootproject: conflicts with monorepo setup
// - expo-module-gradle-plugin: library plugin, shouldn't be applied to app
const PATCHED_LINE =
  "if (!['com.facebook.react.rootproject', 'expo-module-gradle-plugin'].contains(modulePlugin.id)) { project.plugins.apply(modulePlugin.id) }";

function applyPatch() {
  const filePath = path.join(process.cwd(), PATCH_TARGET);

  if (!fs.existsSync(filePath)) {
    console.log("[postinstall] expo-modules-autolinking not found, skipping patch");
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");

  // Check if already patched (check for the new patched line with both plugins)
  if (content.includes("expo-module-gradle-plugin")) {
    console.log("[postinstall] expo-modules-autolinking already patched, skipping");
    return;
  }

  // Check if the original line exists
  if (!content.includes(ORIGINAL_LINE)) {
    console.log(
      "[postinstall] Could not find target line in expo-modules-autolinking, skipping patch"
    );
    return;
  }

  // Apply the patch - replace only the first occurrence in the afterProject block
  // We need to be careful to only replace the one in the plugins.apply context
  const regex = new RegExp(
    `(println " \\$\\{Emojis\\.INFORMATION\\}.*\\n\\s+)(${ORIGINAL_LINE.replace(/\./g, "\\.")})`,
    "g"
  );

  if (regex.test(content)) {
    content = content.replace(regex, `$1${PATCHED_LINE}`);
  } else {
    // Fallback: simple replacement
    content = content.replace(ORIGINAL_LINE, PATCHED_LINE);
  }

  fs.writeFileSync(filePath, content, "utf8");
  console.log(
    "[postinstall] Successfully patched expo-modules-autolinking for monorepo compatibility"
  );
}

function patchExpoModulesCore() {
  const basePath = path.join(
    process.cwd(),
    "node_modules/expo-modules-core/android/src/main/java/expo/modules"
  );

  // Patch 1: Fix BoxShadow.parse call (RN 0.76 compatibility)
  const cssPropsPath = path.join(basePath, "kotlin/views/decorators/CSSProps.kt");
  if (fs.existsSync(cssPropsPath)) {
    let content = fs.readFileSync(cssPropsPath, "utf8");
    if (content.includes("BoxShadow.parse(shadows.getMap(i), view.context)")) {
      content = content.replace(
        "BoxShadow.parse(shadows.getMap(i), view.context)",
        "BoxShadow.parse(shadows.getMap(i))"
      );
      fs.writeFileSync(cssPropsPath, content, "utf8");
      console.log("[postinstall] Patched expo-modules-core CSSProps.kt for RN 0.76");
    }
  }

  // Patch 2: Fix ReactNativeFeatureFlags (RN 0.76 compatibility)
  const featureFlagsPath = path.join(basePath, "rncompatibility/ReactNativeFeatureFlags.kt");
  if (fs.existsSync(featureFlagsPath)) {
    const content = fs.readFileSync(featureFlagsPath, "utf8");
    if (content.includes("enableBridgelessArchitecture()")) {
      const patchedContent = `package expo.modules.rncompatibility

/**
 * A compatibility helper of
 * \`com.facebook.react.config.ReactFeatureFlags\` and
 * \`com.facebook.react.internal.featureflags.ReactNativeFeatureFlags\`
 */
object ReactNativeFeatureFlags {
  // Fallback to false when the method is not available in this RN version
  val enableBridgelessArchitecture = false
}
`;
      fs.writeFileSync(featureFlagsPath, patchedContent, "utf8");
      console.log("[postinstall] Patched expo-modules-core ReactNativeFeatureFlags.kt for RN 0.76");
    }
  }
}

try {
  applyPatch();
  patchExpoModulesCore();
} catch (error) {
  console.error("[postinstall] Error applying patch:", error.message);
  // Don't fail the install
}
