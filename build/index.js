const path = require("path");
const fs = require("fs");
const pack = require("../package.json");
const webpack = require("webpack");
const main = require("./webpack.config"); //主进程

function deleteFolderRecursive(url) {
  let files = [];
  if (fs.existsSync(url)) {
    files = fs.readdirSync(url);
    files.forEach(function (file, index) {
      let curPath = path.join(url, file);
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(url);
  } else {
    console.log("...");
  }
}

deleteFolderRecursive(path.resolve("dist")); //清除dist
webpack([main("production")], (err, stats) => {
  if (err || stats.hasErrors()) {
    // 在这里处理错误
    console.log(stats.stats[0], err);
    throw err;
  }
  fs.writeFileSync(
    "./dist/package.json",
    JSON.stringify(
      {
        name: pack.name,
        version: pack.version,
        dependencies: pack.dependencies,
      },
      null,
      2
    )
  );
  console.log("ok");
});
