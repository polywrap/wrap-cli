import { intlMsg } from "../intl";
import {
  defaultPolywrapManifest,
  defaultAppManifest,
  defaultPluginManifest,
} from "..";
import { resolvePathIfExists } from "../system";

const filterUniqueFn = (value: string, index: number, self: Array<string>) =>
  self.indexOf(value) === index;

export function parseManifestFileOption(
  manifestFile: string | undefined
): string {
  const defaultManifests = [
    ...defaultPolywrapManifest,
    ...defaultAppManifest,
    ...defaultPluginManifest,
  ].filter(filterUniqueFn);

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
