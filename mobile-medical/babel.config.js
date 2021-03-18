module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: {
          evotek_navigations: "./src/navigations",
          evotek_AppNavigate: "./src/navigations/AppNavigate.js",
          evotek_components: "./src/components",
          evotek_commons: "./src/commons",
          evotek_networking: "./src/networking",
        },
      },
    ],
  ],
};
