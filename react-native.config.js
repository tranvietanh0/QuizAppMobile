// React Native configuration for monorepo
// This file is at monorepo root for CLI to find it

const path = require("path");

module.exports = {
  // Point to the mobile app
  project: {
    android: {
      sourceDir: "./apps/mobile/android",
      packageName: "com.quizapp.mobile",
    },
    ios: {
      sourceDir: "./apps/mobile/ios",
    },
  },
  dependencies: {},
};
