import fse from "fs-extra";

const source = process.argv[2];
const dest = process.argv[3];

const ignore = [
  ".env",
  "node_modules",
  "build",
  ".idea",
  ".log",
  ".vscode",
  "w3",
  ".w3",
  ".DS_Store",
  "report.",
  "target",
  ".rs.bk",
  ".lock",
  "bin",
  "pkg",
];

fse.copySync(source, dest, {
  filter: function (path) {
    return ignore.some((ignorePath) => path.includes(ignorePath));
  },
});
