import { intlMsg } from "../intl";
import { defaultAppManifest } from "../";
import { resolvePathIfExists } from "../system";

import path from "path";

const defaultAppCodegenDir = "./src/wrap";

export function parseAppManifestFileOption(
  manifestFile: string | undefined,
  _: unknown
): string {
  const manifestPaths = manifestFile
    ? [manifestFile as string]
    : defaultAppManifest;

  manifestFile = resolvePathIfExists(manifestPaths);

  if (!manifestFile) {
    console.error(
      intlMsg.commands_build_error_manifestNotFound({
        paths: manifestPaths.join(", "),
      })
    );
    process.exit(1);
  }

  return manifestFile;
}

export function defaultAppManifestFileOption(): string {
  return parseAppManifestFileOption(undefined, undefined);
}

export function parseAppCodegenDirOption(
  codegenDir: string | undefined,
  _: unknown
): string {
  return codegenDir
    ? path.resolve(codegenDir)
    : path.resolve(defaultAppCodegenDir);
}

export function defaultAppCodegenDirOption(): string {
  return parseAppCodegenDirOption(undefined, undefined);
}
