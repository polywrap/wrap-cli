import { msgpackEncode } from "@polywrap/msgpack-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { writeFileSync } from "@polywrap/os-js";

export const generateWrapFile = (
  abi: unknown,
  name: string,
  type: "interface" | "wasm" | "plugin",
  path: string,
  encoded = true
): void => {
  const manifest: WrapManifest = {
    abi: abi as never,
    name,
    type,
    version: "0.1.0",
  };
  const stringifyInfo = JSON.stringify(manifest);
  let info = JSON.parse(stringifyInfo);

  let encoding = "utf-8";
  if (encoded) {
    info = msgpackEncode(info);
    encoding = "binary";
  } else {
    info = `export const manifest = ${info}`;
  }

  writeFileSync(path, info, {
    encoding,
  });
};
