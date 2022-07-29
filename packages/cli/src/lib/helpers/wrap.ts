import { msgpackEncode } from "@polywrap/msgpack-js";
import { validateWrapManifest, WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { writeFileSync } from "@polywrap/os-js";

export const generateWrapFile = async (
  abi: unknown,
  name: string,
  type: "interface" | "wasm" | "plugin",
  path: string
): Promise<void> => {
  const info: WrapManifest = {
    abi: abi as never,
    name,
    type,
    version: "0.1.0",
  };

  // One last sanity check
  await validateWrapManifest(info);

  const s = JSON.stringify(info);
  const encodedInfo = msgpackEncode(JSON.parse(s));
  writeFileSync(path, encodedInfo, {
    encoding: "binary",
  });
};