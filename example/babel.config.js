module.exports = function(api) {
  api.cache(true);

  const presets = [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "entry",
        "corejs": "3"
      }
    ],
    "@babel/preset-typescript",
    "@babel/preset-react",
  ];

  const plugins = [
    "@babel/plugin-transform-modules-commonjs",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["import", { libraryName: "antd", libraryDirectory: "es", style: "less" }, "ant"],
  ];

  return {
    presets,
    plugins
  };
};