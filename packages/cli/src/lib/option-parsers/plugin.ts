import { intlMsg } from "../intl";
import { defaultPluginManifest } from "../";
import { resolvePathIfExists } from "../system";

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
