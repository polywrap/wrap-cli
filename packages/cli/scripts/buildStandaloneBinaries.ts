// eslint-disable-next-line import/no-extraneous-dependencies
import { exec } from "pkg";
import path from "path";
import os from "os";

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
  const compression = isProd ? "Brotli" : "GZip";

  if (isProd) {
    for (const target of targets) {
      await compileTarget(target, cliRoot, binPath, compression);
    }
  } else {
    const target = getPlatformAndArch();
    await compileTarget(target, cliRoot, binPath, compression);
  }
}

async function compileTarget(
  target: string,
  cliRoot: string,
  binPath: string,
  compression: string
) {
  const targetPath = path.join(binPath, target, "polywrap");
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

const getPlatformAndArch = (): string => {
  const supportedPlatforms: Record<string, string> = {
    darwin: "macos",
    win32: "win",
    linux: "linux",
  };
  const supportedArchitectures: Record<string, string> = {
    x64: "x64",
    arm64: "arm64",
  };

  const platform = supportedPlatforms[os.platform()];
  const arch = supportedArchitectures[os.arch()];

  if (!platform || !arch) {
    throw new Error(`Unsupported platform or architecture.
Supported platforms: ${Object.keys(supportedPlatforms).toString()}.
Supported architectures: ${Object.keys(supportedArchitectures).toString()}`);
  }

  if (platform === "win") {
    return `${platform}-${arch}.exe`;
  }
  return `${platform}-${arch}`;
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
