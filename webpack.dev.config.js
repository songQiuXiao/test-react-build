"use strict";

const webpack = require("webpack");
const path = require("path");

const paths = {
  src: {
    main: path.join(__dirname, "src/main-app"),
    another: path.join(__dirname, "src/another-app"),
  },
  dest: path.join(__dirname, "src/server/public/javascripts/"),
};

const devEntryFilter = (() => {
  const fs = require("fs");
  const id = (_) => _;
  const entryFilterFile = "./webpack.dev.entry_filter";
  try {
    fs.accessSync(`${entryFilterFile}.js`);
    const filter = require(entryFilterFile);
    if (filter instanceof Array && filter.length > 0) {
      return (_entries) => {
        const entries = _entries ? _entries : {};
        console.log(
          `[devEntryFilter] ${filter.length} of ${
            Object.keys(entries).length
          } entries will load: ${filter.join(", ")}`
        );
        const result = filter.reduce((nextEntries, entryKey) => {
          if (entries[entryKey]) {
            nextEntries = Object.assign(nextEntries, {
              [entryKey]: entries[entryKey],
            });
          }
          return nextEntries;
        }, {});
        return result;
      };
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}
  return id;
})();

module.exports = {
  mode: "development",
  cache: true,
  entry: devEntryFilter({
    main: [
      "react-hot-loader/patch",
      "webpack-hot-middleware/client",
      path.join(paths.src.main, "/index.js"),
    ],
    another: [
      "react-hot-loader/patch",
      "webpack-hot-middleware/client",
      path.join(paths.src.another, "/index.js"),
    ],
  }),
  output: {
    path: paths.dest,
    filename: "[name].js",
    publicPath: "/javascripts/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [path.resolve(__dirname, "node_modules")],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              require("@babel/plugin-proposal-class-properties"),
              require("@babel/plugin-proposal-object-rest-spread"),
              require("react-hot-loader/babel"),
            ],
            cacheDirectory: true,
          },
        },
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".js", ".json", ".ts", ".tsx", ".wasm", ".mjs"],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __DEVTOOLS__: true,
      "process.env": {
        // Useful to reduce the size of client-side libraries, e.g. react
        NODE_ENV: JSON.stringify("development"),
        PROXY_TARGET: JSON.stringify(process.env.PROXY_TARGET),
      },
    }),
  ],
  devtool: "cheap-eval-source-map",
};
