import { AnyProjectManifestLanguage } from "../manifests";
import { ManifestProjectTypeProps } from "./getProjectFromManifest";

import YAML from "yaml";

export function getProjectManifestLanguage(
  manifestStr: string
): AnyProjectManifestLanguage | undefined {
  let manifest: ManifestProjectTypeProps | undefined;

  try {
    manifest = JSON.parse(manifestStr) as ManifestProjectTypeProps;
  } catch (_) {
    try {
      manifest = YAML.parse(manifestStr) as ManifestProjectTypeProps;
    } catch (_) { }
  }

  return manifest?.project?.type ?? manifest?.language;
}
