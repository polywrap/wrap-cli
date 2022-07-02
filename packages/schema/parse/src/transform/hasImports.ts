import { AbiTransforms } from ".";
import { Abi } from "../abi";

export const hasImports: AbiTransforms = {
  enter: {
    Abi: (abi: Abi) => ({
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
