import { msgpackEncode } from "@polywrap/msgpack-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { writeFileSync } from "@polywrap/os-js";

export const generateWrapFile = (
  abi: unknown,
  name: string,
  type: "interface" | "wasm" | "plugin",
  path: string
): void => {
  const info: WrapManifest = {
    abi: abi as never,
    name,
    type,
    version: "0.1.0",
  };

  const s = JSON.stringify(info);
  const encodedInfo = msgpackEncode(JSON.parse(s));
  writeFileSync(path, encodedInfo, {
    encoding: "binary",
  });
};
