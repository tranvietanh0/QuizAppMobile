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
const PATCHED_LINE =
  "if (modulePlugin.id != 'com.facebook.react.rootproject') { project.plugins.apply(modulePlugin.id) }";

function applyPatch() {
  const filePath = path.join(process.cwd(), PATCH_TARGET);

  if (!fs.existsSync(filePath)) {
    console.log("[postinstall] expo-modules-autolinking not found, skipping patch");
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");

  // Check if already patched
  if (content.includes("com.facebook.react.rootproject")) {
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

try {
  applyPatch();
} catch (error) {
  console.error("[postinstall] Error applying patch:", error.message);
  // Don't fail the install
}
