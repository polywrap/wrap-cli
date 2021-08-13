import fs from "fs";
import { SemVer } from "semver";
import { writeFileSync } from "@web3api/os-js";

const packageJsonFilePath = `${__dirname}/../package.json`;
const versionFilePath = `${__dirname}/../../../VERSION`;

function main() {
  const packageJsonFile = fs.readFileSync(packageJsonFilePath, "utf-8");
  const packageJson = JSON.parse(packageJsonFile);
  const versionFile = fs.readFileSync(versionFilePath, "utf-8");
  const version = new SemVer(versionFile).format();
  const downgradedVersionSemver = new SemVer(version);
  (downgradedVersionSemver as any).prerelease[1] -= 1;
  const downgradedVersion = downgradedVersionSemver.format();

  for (const dependency of Object.keys(packageJson.dependencies)) {
    const requiresDowngrade =
      dependency.indexOf("@web3api") > -1 &&
      (dependency.indexOf("plugin") > -1 || dependency.indexOf("client-js") > -1);

    if (requiresDowngrade) {
      // Apply this version to the package.json
      packageJson.dependencies[dependency] = downgradedVersion;
    }
  }

  writeFileSync(
    packageJsonFilePath,
    JSON.stringify(packageJson, null, 2)
  );
}

try {
  main();
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
