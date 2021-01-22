const fs = require("fs");
const path = require("path");
const { src, dest, series } = require("gulp");
const PluginError = require("plugin-error");
const log = require("fancy-log");
const rev = require("@mokahr/gulp-revision-hash");
const { spawn } = require("child_process");
const del = require("del");
const webpack = require("webpack");

let lastCommit = {};
const PATHS = {
  SRC: "./src",
  DIST: "./dist",
  PUBLIC: "./src/server/public", // 静态资源文件
};

async function setDevEnvironment() {
  process.env.NODE_ENV = "development";
}

async function setProdEnvironment() {
  process.env.NODE_ENV = "production";
}

async function generateWebpackEntryFilter() {
  const fileName = "webpack.dev.entry_filter";
  const file = `${fileName}.js`;
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
  const entries = require("./webpack.dev.config").entry;
  fs.writeFileSync(
    file,
    `module.exports = [\n${Object.keys(entries)
      .map((key) => `  '${key}'`)
      .join(",\n")}\n];\n`
  );
}

async function startDevServer() {
  const server = spawn("node", [
    "--max_old_space_size=4096",
    "./src/devServer.js",
  ]);
  server.stdout.on("data", (data) => console.log(data.toString()));
  server.stderr.on("data", (data) => console.error(data.toString()));
}

function cleanDist() {
  return del(PATHS.DIST);
}

async function compile() {
  await new Promise((resolve, reject) => {
    webpack(require("./webpack.prod.config"), (err, stats) => {
      if (err || stats.hasErrors()) {
        if (stats) {
          log("[Webpack]", stats.toString({ colors: true }));
        }
        reject(new PluginError("[Webpack]", err));
      }

      log("[Webpack]", stats.toString({ colors: true }));
      resolve();
    });
  });
}
function revision() {
  const webpackProdEntries = Object.keys(
    require("./webpack.prod.config").entry
  );
  const needReversionJsFilePath = [];
  const needReversionJsMapFilePath = [];
  const needReversionCssFilePath = [];
  webpackProdEntries.forEach((fileName) => {
    needReversionJsFilePath.push(
      path.join(PATHS.PUBLIC, "/javascripts", `/${fileName}.js`)
    );
    needReversionJsMapFilePath.push(
      path.join(PATHS.PUBLIC, "/javascripts", `/${fileName}.js.map`)
    );
    needReversionCssFilePath.push(
      path.join(PATHS.PUBLIC, "/stylesheets", `/${fileName}.css`)
    );
  });
  return src(
    [
      ...needReversionCssFilePath,
      ...needReversionJsFilePath,
      ...needReversionJsMapFilePath,
    ],
    { allowEmpty: true }
  )
    .pipe(rev(process.env.RELEASE_TAG || lastCommit.hash)) // 如果lastCommit获取失败, 默认时候内置的revision内置hash
    .pipe(
      dest((file) => {
        return path.dirname(file.path);
      })
    )
    .pipe(rev.manifest("manifest.json"))
    .pipe(dest(path.join(PATHS.PUBLIC)));
}

function copyPublicFolder() {
  return src([path.join(PATHS.PUBLIC, "/**/*")]).pipe(
    dest(path.join(PATHS.DIST, "/public"))
  );
}

/**
 * 生成webpack.dev.entry_filter文件
 */
exports.getEntry = generateWebpackEntryFilter;

/**
 * 启动本地开发环境
 */
exports.start = series(setDevEnvironment, startDevServer);

/**
 * 前端打包
 */
exports.build = series(
  setProdEnvironment,
  cleanDist,
  compile,
  revision,
  copyPublicFolder
);

exports.revision = revision;
exports.cleanDist = cleanDist;
