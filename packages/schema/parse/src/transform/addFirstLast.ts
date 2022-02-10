import { TypeInfoTransforms } from ".";
import { TypeInfo, GenericDefinition } from "../typeInfo";

export const addFirstLast: TypeInfoTransforms = {
  enter: {
    GenericDefinition: (def: GenericDefinition): GenericDefinition => {
      const arrays: Record<string, unknown[]> = {};

      for (const key of Object.keys(def)) {
        const value = ((def as unknown) as Record<string, unknown>)[key];

        if (Array.isArray(value)) {
          arrays[key] = setFirstLast(value);
        }
      }

      return {
        ...def,
        ...arrays,
      };
    },
    TypeInfo: (typeInfo: TypeInfo): TypeInfo => ({
      ...typeInfo,
      objectTypes: setFirstLast(typeInfo.objectTypes),
      moduleTypes: setFirstLast(typeInfo.moduleTypes),
      importedObjectTypes: setFirstLast(typeInfo.importedObjectTypes),
      importedModuleTypes: setFirstLast(typeInfo.importedModuleTypes),
    }),
  },
};

function setFirstLast<T>(array: T[]): T[] {
  return array.map((item, index) => {
    if (typeof item === "object") {
      return {
        ...item,
        first: index === 0 ? true : null,
        last: index === array.length - 1 ? true : null,
      };
    } else {
      return item;
    }
  });
}
