module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    [
      "babel-plugin-react-compiler",
      {
        runtimeModule: "react-compiler-runtime",
      },
    ],
    "react-native-reanimated/plugin",
  ],
};
