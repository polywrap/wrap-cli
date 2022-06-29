import { CompilerOverrides } from "../../../../Compiler";
import { intlMsg } from "../../../../intl";

import { PolywrapManifest } from "../../../../polywrap-manifests";

export function getCompilerOverrides(): CompilerOverrides {
  return {
    validateManifest: (manifest: PolywrapManifest) => {
      const module = manifest.module;

      if (module && module.indexOf("Cargo.toml") === -1) {
        throw Error(intlMsg.lib_wasm_rust_invalidModule({ path: module }));
      }
    },
    generationSubPath: "src/wrap",
  };
}
