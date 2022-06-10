import { CompilerOverrides } from "../../../../Compiler";
import { intlMsg } from "../../../../intl";

import { Web3ApiManifest } from "@web3api/core-js";

export function getCompilerOverrides(): CompilerOverrides {
  return {
    validateManifest: (manifest: Web3ApiManifest) => {
      const module = manifest.main

      if (module && module.indexOf("Cargo.toml") === -1) {
        throw Error(intlMsg.lib_wasm_rust_invalidModule({ path: module }));
      }
    },
    generationSubPath: "src/w3",
  };
}