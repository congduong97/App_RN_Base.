module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
};


module.exports =  {
  const presets = ["module:metro-react-native-babel-preset"];
  const plugins = [
    [
      "module-resolver",
      {
        root: ["."],
        alias: {
          "@components": "./src/components",
          "@commons": "./src/commons",
          "@AppNavigate": "/src/navigations/AppNavigate",
          "@networking": "./src/networking",
        },
      },
    ],
  ];
  return {
    presets,
    plugins,
  };
};
