import { intlMsg } from "../intl";
import { resolvePathIfExists } from "../system";
import {
  defaultAppManifest,
  defaultPluginManifest,
  defaultWeb3ApiManifest,
} from "../manifest";

import path from "path";

const defaultDocgenDir = "./w3";

export function parseDocgenManifestFileOption(
  manifestFile: string | undefined,
  _: unknown
): string {
  const manifestPaths = manifestFile
    ? [manifestFile]
    : defaultWeb3ApiManifest
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
