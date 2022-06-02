import { TypeInfoTransforms } from ".";
import { TypeInfo } from "../typeInfo";

export const hasImports: TypeInfoTransforms = {
  enter: {
    TypeInfo: (typeInfo: TypeInfo) => ({
      ...typeInfo,
      hasImports: () => {
        return (
          typeInfo.importedEnumTypes.length ||
          typeInfo.importedObjectTypes.length ||
          typeInfo.importedModuleTypes.length
        );
      },
    }),
  },
};
