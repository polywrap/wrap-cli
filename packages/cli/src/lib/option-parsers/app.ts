import { intlMsg } from "../intl";
import { defaultAppManifest } from "../";
import { resolvePathIfExists } from "../system";

export function parseAppManifestFileOption(
  manifestFile: string | undefined
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
