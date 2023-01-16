import { AbiTransforms } from ".";

import { GenericDefinition, WrapAbi } from "@polywrap/wrap-manifest-types-js";

export const moduleHasEnv = (): AbiTransforms => {
  let hasEnv = false;

  return {
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
};
