import { intlMsg } from "../intl";
import { defaultAppManifest, defaultPluginManifest } from "../project";
import { resolvePathIfExists } from "../system";

import path from "path";

const deprecatedDefaultManifests = [
  ...defaultAppManifest,
  ...defaultPluginManifest,
];

export function parseManifestFileOption(
  manifestFile: string | undefined | false,
  defaults: string[]
): string {
  const didUserProvideManifestFile =
    manifestFile && !!manifestFile.length;

  const manifestPaths = manifestFile ? [manifestFile as string] : defaults;

  manifestFile = resolvePathIfExists(manifestPaths);

  if (!manifestFile) {
    console.error(
      intlMsg.commands_build_error_manifestNotFound({
        paths: manifestPaths.join(", "),
      })
    );
    process.exit(1);
  }

  const fileName = path.basename(manifestFile);

  if (
    !didUserProvideManifestFile &&
    deprecatedDefaultManifests.includes(fileName)
  ) {
    console.warn(
      intlMsg.lib_option_defaults_deprecated_project_manifest({
        fileName: path.basename(fileName),
      })
    );
  }

  return manifestFile;
}
