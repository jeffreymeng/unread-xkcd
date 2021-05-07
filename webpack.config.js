const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    contentScript: "./src/content-script.ts",
    popup: "./src/popup/index.ts",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/manifest.json",
        },
        {
          from: "src/icons",
          to: "icons",
        },
        {
          from: "src/popup",
          to: "./",
          filter: (path) => {
            return /\.(html|css)$/.test(path);
          },
        },
      ],
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
};
