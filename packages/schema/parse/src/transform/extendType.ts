import { TypeInfoTransforms } from ".";
import { GenericDefinition } from "../typeInfo";

export function extendType(extension: any): TypeInfoTransforms {
  return {
    enter: {
      GenericDefinition: (def: GenericDefinition) => ({
        ...def,
        ...extension
      })
    }
  }
}
