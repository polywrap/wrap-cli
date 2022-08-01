import { msgpackEncode } from "@polywrap/msgpack-js";
import {
  latestWrapManifestVersion,
  validateWrapManifest,
  WrapManifest,
} from "@polywrap/wrap-manifest-types-js";
import { writeFileSync } from "@polywrap/os-js";

export const generateWrapFile = async (
  abi: unknown,
  name: string,
  type: "interface" | "wasm" | "plugin",
  path: string
): Promise<void> => {
  const info: WrapManifest = {
    version: latestWrapManifestVersion,
    name,
    type,
    /// TODO(cbrzn): Change this to WrapAbi
    abi: abi as never,
  };

  // One last sanity check
  await validateWrapManifest(info);
  const parsedInfo = JSON.parse(JSON.stringify(info));
  writeFileSync(path, msgpackEncode(parsedInfo), {
    encoding: "binary",
  });
};
