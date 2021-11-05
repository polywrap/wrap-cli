import fs from "fs-extra"; 
import rimraf from "rimraf";

const srcDir = `${__dirname}/../src/lib/default-manifests`;
const destDir = `${__dirname}/../build/lib/default-manifests`;

function main() {
  rimraf.sync(destDir);
  fs.copySync(srcDir, destDir, { overwrite: true });
}

try {
  main();
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
