import { withSpinner } from "./spinner";
import { intlMsg } from "../intl";
import { displayPath } from "../system";

import {
  serializeWrapManifest,
  latestWrapManifestVersion,
  WrapManifest,
  WrapAbi,
} from "@polywrap/wrap-manifest-types-js";
import { normalizePath, writeFileSync } from "@polywrap/os-js";

const run = async (
  abi: WrapAbi,
  name: string,
  type: "interface" | "wasm" | "plugin",
  path: string
): Promise<void> => {
  const manifest: WrapManifest = {
    version: latestWrapManifestVersion,
    name,
    type,
    abi
  };

  const bytes = await serializeWrapManifest(manifest);

  writeFileSync(path, bytes, { encoding: "binary" });
};

export const generateWrapFile = async (
  abi: WrapAbi,
  name: string,
  type: "interface" | "wasm" | "plugin",
  path: string,
  quiet = false
): Promise<void> => {
  if (quiet) {
    return run(abi, name, type, path);
  } else {
    const relativePath = displayPath(path);
    return await withSpinner(
      intlMsg.lib_helpers_manifest_outputText({
        path: normalizePath(relativePath),
      }),
      intlMsg.lib_helpers_manifest_outputError({
        path: normalizePath(relativePath),
      }),
      intlMsg.lib_helpers_manifest_outputWarning({
        path: normalizePath(relativePath),
      }),
      async (_spinner): Promise<void> => {
        await run(abi, name, type, path);
      }
    );
  }
};
