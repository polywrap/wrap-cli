import { CompilerOverrides } from "../../../../Compiler";
import { intlMsg } from "../../../../intl";

import { Web3ApiManifest } from "@polywrap/core-js";

export function getCompilerOverrides(): CompilerOverrides {
  return {
    validateManifest: (manifest: Web3ApiManifest) => {
      const module = manifest.module;

      if (module && module.indexOf("Cargo.toml") === -1) {
        throw Error(intlMsg.lib_wasm_rust_invalidModule({ path: module }));
      }
    },
    generationSubPath: "src/polywrap",
  };
}
