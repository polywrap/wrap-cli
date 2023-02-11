import { AbiTransforms } from ".";

// TODO: where is this one used?

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function extendType(extension: any): AbiTransforms {
  return {
    enter: {
      Abi: (abi) => ({
        ...abi,
        extension,
      }),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      DefinitionOrType: (def) => ({
        ...def,
        ...extension,
      }),
    },
  };
}
