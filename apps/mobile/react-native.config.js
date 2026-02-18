// React Native configuration for monorepo
// This helps autolinking work correctly with pnpm workspaces

const path = require("path");

const monorepoRoot = path.resolve(__dirname, "../..");

module.exports = {
  project: {
    android: {
      sourceDir: "./android",
      packageName: "com.quizapp.mobile",
    },
    ios: {
      sourceDir: "./ios",
    },
  },
  // Dependencies are resolved from the monorepo root
  dependencies: {},
  // Assets paths
  assets: ["./assets/fonts"],
};
