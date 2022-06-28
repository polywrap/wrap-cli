import { AbiTransforms } from ".";
import { GenericDefinition, Abi } from "../abi";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function extendType(extension: any): AbiTransforms {
  return {
    enter: {
      Abi: (abi: Abi) => ({
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
