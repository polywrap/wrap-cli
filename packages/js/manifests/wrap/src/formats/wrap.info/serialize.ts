import {
  AnyWrapManifest,
  validateWrapManifest
} from ".";
import { SerializeManifestOptions } from "../../";

import { msgpackEncode } from "@polywrap/msgpack-js";

export async function serializeWrapManifest(
  manifest: AnyWrapManifest,
  options?: SerializeManifestOptions
): Promise<Uint8Array> {
  if (!options || !options.noValidate) {
    await validateWrapManifest(manifest);
  }

  return msgpackEncode(manifest, true);
}
