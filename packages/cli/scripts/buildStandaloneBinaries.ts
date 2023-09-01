// eslint-disable-next-line import/no-extraneous-dependencies
import { exec } from "pkg";
import path from "path";

const cliRoot = path.resolve(__dirname + "/..");
const binPath = path.join(cliRoot, "standalone-binaries");
const isProd = process.argv.includes("--prod");
const targets = [
  "macos-arm64",
  "macos-x64",
  "linux-arm64",
  "linux-x64",
  "win-arm64",
  "win-x64",
];

async function main() {
  for (const target of targets) {
    const targetPath = path.join(binPath, target, "polywrap");
    const compression = isProd ? "Brotli" : "GZip";
    await exec([
      cliRoot,
      "-t",
      `node18-${target}`,
      "--output",
      targetPath,
      "--compress",
      compression,
    ]);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
