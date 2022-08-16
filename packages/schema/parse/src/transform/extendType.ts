import { AbiTransforms } from ".";

import { GenericDefinition, WrapAbi } from "@polywrap/wrap-manifest-types-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function extendType(extension: any): AbiTransforms {
  return {
    enter: {
      Abi: (abi: WrapAbi) => ({
        ...abi,
        extension,
      }),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      GenericDefinition: (def: GenericDefinition) => ({
        ...def,
        ...extension,
      }),
    },
  };
}
