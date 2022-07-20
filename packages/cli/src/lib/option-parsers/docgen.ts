import { intlMsg } from "../intl";
import { resolvePathIfExists } from "../system";
import {
  defaultAppManifest,
  defaultPluginManifest,
  defaultPolywrapManifest,
} from "../project";

import path from "path";

const defaultDocgenDir = "./wrap";

export function parseDocgenManifestFileOption(
  manifestFile: string | undefined,
  _: unknown
): string {
  const manifestPaths = manifestFile
    ? [manifestFile]
    : defaultPolywrapManifest
        .concat(defaultAppManifest)
        .concat(defaultPluginManifest);
  manifestFile = resolvePathIfExists(manifestPaths);

  if (!manifestFile) {
    console.error(
      intlMsg.commands_app_error_manifestNotFound({
        paths: manifestPaths.join(", "),
      })
    );
    process.exit(1);
  }

  return manifestFile;
}

export function defaultDocgenManifestFileOption(): string {
  return parseDocgenManifestFileOption(undefined, undefined);
}

export function parseDocgenDirOption(
  codegenDir: string | undefined,
  _: unknown
): string {
  return codegenDir ? path.resolve(codegenDir) : path.resolve(defaultDocgenDir);
}

export function defaultDocgenDirOption(): string {
  return parseDocgenDirOption(undefined, undefined);
}
