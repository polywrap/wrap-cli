import { AbiTransforms } from ".";

export const hasImports: AbiTransforms = {
  enter: {
    Abi: (abi) => ({
      ...abi,
      hasImports: () => abi.imports && abi.imports.length,
    }),
  },
};
