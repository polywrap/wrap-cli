import { CompilerOverrides } from "../../../Compiler";
import { intlMsg } from "../../../intl";

import { Web3ApiManifest } from "@web3api/core-js";

export function getCompilerOverrides(): CompilerOverrides {
  return {
    validateManifest: (manifest: Web3ApiManifest) => {
      const queryModule = manifest.modules.query?.module;
      const mutationModule = manifest.modules.mutation?.module;

      if (queryModule && queryModule.indexOf("Cargo.toml") === -1) {
        throw Error(intlMsg.lib_wasm_rust_invalidModule({ path: queryModule }));
      }

      if (mutationModule && mutationModule.indexOf("Cargo.toml") === -1) {
        throw Error(
          intlMsg.lib_wasm_rust_invalidModule({ path: mutationModule })
        );
      }
    },
    generationSubPath: "src/w3",
  };
}
