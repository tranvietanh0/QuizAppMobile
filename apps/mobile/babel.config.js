module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./src",
            "@/app": "./app",
            "@/components": "./src/components",
            "@/hooks": "./src/hooks",
            "@/services": "./src/services",
            "@/stores": "./src/stores",
            "@/theme": "./src/theme",
            "@/utils": "./src/utils",
          },
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
