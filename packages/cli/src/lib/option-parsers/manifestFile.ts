import { intlMsg } from "../intl";
import { resolvePathIfExists } from "../system";
import { defaultManifestFiles } from "../option-defaults";

export function parseManifestFileOption(
  manifestFile: string | undefined
): string {
  const manifestPaths = manifestFile
    ? [manifestFile as string]
    : defaultManifestFiles;

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
