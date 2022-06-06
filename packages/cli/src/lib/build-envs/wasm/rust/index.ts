import { CompilerOverrides } from "../../../Compiler";

import { Web3ApiManifest } from "@web3api/core-js";

export function getCompilerOverrides(): CompilerOverrides {
  return {
    validateManifest: (_: Web3ApiManifest) => undefined,
    generationSubPath: "src/w3",
  };
}
