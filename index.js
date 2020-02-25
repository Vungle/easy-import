const fs = require("fs");
const path = require("path");

const findFile = (rootDir, value, subDir) => {
  const absolutePath = subDir || rootDir;
  let file;
  fs.readdirSync(absolutePath).forEach(fileName => {
    if (file) {
      return;
    }
    const filePath = path.join(absolutePath, fileName);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      file = findFile(rootDir, value, filePath);
      return;
    }
    const ext = path.extname(filePath);
    if (ext === ".js" || ext === ".jsx") {
      const content = fs.readFileSync(filePath, { encoding: "utf-8" });
      if (content.indexOf(`@package ${value}\n`) !== -1) {
        file = filePath;
      }
    }
  });
  return file;
};

const cacheMap = {};

module.exports = function() {
  return {
    visitor: {
      ImportDeclaration(p, state) {
        const dirsToTraverse = state.opts.directories;
        const value = p.node.source.value;
        if (cacheMap[value]) {
          p.node.source.value = cacheMap[value];
          return;
        }
        const rootDir = process.cwd();
        let file = null;
        dirsToTraverse.forEach(dir => {
          if (file) {
            return;
          }
          file = findFile(path.join(rootDir, dir), value);
          if (file) {
            const { from, to } = state.opts;
            if (from && to) {
              file = file.replace(from, to);
            }
            p.node.source.value = file;
            cacheMap[value] = file;
          }
        });
      }
    }
  };
};

