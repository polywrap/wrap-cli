import { AbiTransforms } from ".";

import { GenericDefinition, WrapAbi } from "@polywrap/wrap-manifest-types-js";

let hasEnv = false;
export const moduleHasEnv: AbiTransforms = {
  enter: {
    Abi: (abi: WrapAbi): WrapAbi => {
      hasEnv = !!abi.envType;
      return abi;
    },
  },
  leave: {
    ModuleDefinition: (moduleDefinition: GenericDefinition) => ({
      ...moduleDefinition,
      hasEnv,
    }),
  },
};
