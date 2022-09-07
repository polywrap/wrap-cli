import { intlMsg } from "../intl";
import { resolvePathIfExists } from "../system";
import {
  defaultAppManifest,
  defaultPluginManifest,
  defaultPolywrapManifest,
} from "../project";

export function parseDocgenManifestFileOption(
  manifestFile: string | undefined
): string {
  const manifestPaths = manifestFile
    ? [manifestFile]
    : defaultPolywrapManifest
        .concat(defaultAppManifest)
        .concat(defaultPluginManifest);
  manifestFile = resolvePathIfExists(manifestPaths);

  if (!manifestFile) {
    console.error(
      intlMsg.commands_docgen_error_manifestNotFound({
        paths: manifestPaths.join(", "),
      })
    );
    process.exit(1);
  }

  return manifestFile;
}
