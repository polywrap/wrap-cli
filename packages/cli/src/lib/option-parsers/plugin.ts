import { intlMsg } from "../intl";
import { defaultPluginManifest } from "../";
import { resolvePathIfExists } from "../system";

import path from "path";

const defaultPluginPublishDir = "./build";
const defaultPluginCodegenDir = "./wrap";

export function parsePluginManifestFileOption(
  manifestFile: string | undefined,
  _: unknown
): string {
  const manifestPaths = manifestFile
    ? [manifestFile as string]
    : defaultPluginManifest;
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

export function defaultPluginManifestFileOption(): string {
  return parsePluginManifestFileOption(undefined, undefined);
}

export function parsePluginCodegenDirOption(
  codegenDir: string | undefined,
  _: unknown
): string {
  return codegenDir
    ? path.resolve(codegenDir)
    : path.resolve(defaultPluginCodegenDir);
}

export function defaultPluginCodegenDirOption(): string {
  return parsePluginCodegenDirOption(undefined, undefined);
}

export function parsePluginPublishDirOption(
  publishDir: string | undefined,
  _: unknown
): string {
  return publishDir
    ? path.resolve(publishDir)
    : path.resolve(defaultPluginPublishDir);
}

export function defaultPluginPublishDirOption(): string {
  return parsePluginPublishDirOption(undefined, undefined);
}
