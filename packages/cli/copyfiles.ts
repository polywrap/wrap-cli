import fse from "fs-extra";

const source = process.argv[2];
const dest = process.argv[3];

const ignore = [
  ".env",
  "node_modules",
  ".idea",
  ".log",
  ".vscode",
  ".polywrap",
  ".rs.bk",
  ".lock",
];

fse.copySync(source, dest, {
  filter: function (path) {
    return !ignore.some((ignorePath) => path.endsWith(ignorePath));
  },
});
