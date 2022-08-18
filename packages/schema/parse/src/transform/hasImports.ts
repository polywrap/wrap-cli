import { AbiTransforms } from ".";

import { WrapAbi } from "@polywrap/wrap-manifest-types-js";

export const hasImports: AbiTransforms = {
  enter: {
    Abi: (abi: WrapAbi) => ({
      ...abi,
      hasImports: () => {
        return (
          (abi.importedEnumTypes && abi.importedEnumTypes.length) ||
          (abi.importedObjectTypes && abi.importedObjectTypes.length) ||
          (abi.importedModuleTypes && abi.importedModuleTypes.length) ||
          (abi.importedEnvTypes && abi.importedEnvTypes.length)
        );
      },
    }),
  },
};
