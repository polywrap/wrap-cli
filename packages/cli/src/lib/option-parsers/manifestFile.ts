import { intlMsg } from "../intl";
import { resolvePathIfExists } from "../system";

export function parseManifestFileOption(
  manifestFile: string | undefined,
  defaults: string[]
): string {
  const manifestPaths = manifestFile
    ? [manifestFile as string]
    : defaults;

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
