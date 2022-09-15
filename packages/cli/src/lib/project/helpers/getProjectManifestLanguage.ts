import { AnyProjectManifestLanguage } from "../manifests";
import YAML from "js-yaml";
import { ManifestProjectTypeProps } from "./getProjectFromManifest";


export function getProjectManifestLanguage(
  manifestStr: string
): AnyProjectManifestLanguage | undefined {
  let manifest: ManifestProjectTypeProps | undefined;

  try {
    manifest = JSON.parse(manifestStr) as ManifestProjectTypeProps;
  } catch (e) {
    manifest = YAML.safeLoad(manifestStr) as ManifestProjectTypeProps |
      undefined;
  }

  return manifest?.project?.type ?? manifest?.language;
}
