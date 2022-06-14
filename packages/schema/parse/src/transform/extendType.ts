import { TypeInfoTransforms } from ".";
import { GenericDefinition, TypeInfo } from "../typeInfo";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function extendType(extension: any): TypeInfoTransforms {
  return {
    enter: {
      TypeInfo: (typeInfo: TypeInfo) => ({
        ...typeInfo,
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
