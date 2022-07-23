import { AbiTransforms } from ".";

import { WrapAbi } from "@polywrap/wrap-manifest-types-js";

export const hasImports: AbiTransforms = {
  enter: {
    Abi: (abi: WrapAbi) => ({
      ...abi,
      hasImports: () => {
        return (
          abi.importedEnumTypes.length ||
          abi.importedObjectTypes.length ||
          abi.importedModuleTypes.length ||
          abi.importedEnvTypes.length
        );
      },
    }),
  },
};
