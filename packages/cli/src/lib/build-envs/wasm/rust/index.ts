import { CompilerOverrides } from "../../../Compiler";
import { Web3ApiProject } from "../../../project";
import { intlMsg } from "../../../intl";

import { Web3ApiManifest } from "@web3api/core-js";
import path from "path";

export function validateManifest(manifest: Web3ApiManifest): void {
  const queryModule = manifest.modules.query?.module;
  const mutationModule = manifest.modules.mutation?.module;

  if (queryModule && queryModule.indexOf("Cargo.toml") === -1) {
    throw Error(intlMsg.lib_wasm_rust_invalidModule({ path: queryModule }));
  }

  if (mutationModule && mutationModule.indexOf("Cargo.toml") === -1) {
    throw Error(intlMsg.lib_wasm_rust_invalidModule({ path: mutationModule }));
  }
}

export function getCompilerOverrides(project: Web3ApiProject): CompilerOverrides {
  return {
    getGenerationDirectory: (entryPoint: string): string => {
      const absolute = path.isAbsolute(entryPoint)
        ? entryPoint
        : path.join(project.getWeb3ApiManifestDir(), entryPoint);
      return `${path.dirname(absolute)}/src/w3`;
    }
  }
}
