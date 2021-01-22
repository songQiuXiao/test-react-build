/* eslint-env node */
const express = require("express");
const webpack = require("webpack");
const config = require("../webpack.dev.config.js");
const path = require("path");

const app = express();

const compiler = webpack(config);

app.use(
  require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    // display no info to console (only warnings and errors)
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
      modules: false,
      builtAt: false,
      assets: false,
      entrypoints: false,
      hash: false,
      version: false,
    },
  })
);

app.use(require("webpack-hot-middleware")(compiler));

app.use(/\/javascripts/, function (req, res) {
  res.end(); // we use babel-loader in dev mode, no need to proxy /javascripts/*
});

app.use(express.static(path.join(__dirname, "server", "public")));

const port = parseInt(process.env.MAGE_DEV_PORT) || 3000;

app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log("Listening to both your IP and http://localhost:" + port + "…");
});
