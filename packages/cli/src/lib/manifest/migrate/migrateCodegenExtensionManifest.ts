import { migrateAnyManifest } from "./migrateAnyManifest";

import {
  AnyCodegenManifest,
  latestCodegenManifestFormat,
  migrateCodegenManifest,
} from "@polywrap/polywrap-manifest-types-js";

export function migrateCodegenExtensionManifest(
  manifestString: string
): string {
  return migrateAnyManifest(
    manifestString,
    "CodegenManifest",
    (manifest: AnyCodegenManifest) =>
      migrateCodegenManifest(manifest, latestCodegenManifestFormat)
  );
}
