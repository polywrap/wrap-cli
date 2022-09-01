import { intlMsg } from "../intl";
import {
  defaultPolywrapManifest,
  defaultAppManifest,
  defaultPluginManifest,
} from "../";
import { resolvePathIfExists } from "../system";

export function parseWasmManifestFileOption(
  manifestFile: string | undefined
): string {
  const defaultManifests = defaultPolywrapManifest.concat(defaultAppManifest).concat(defaultPluginManifest);
  
  const manifestPaths = manifestFile
    ? [manifestFile as string]
    : defaultManifests;

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
