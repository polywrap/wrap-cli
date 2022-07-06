import { AbiTransforms } from ".";
import { Abi, GenericDefinition } from "../abi";

export const addFirstLast: AbiTransforms = {
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
    Abi: (abi: Abi): Abi => ({
      ...abi,
      objectTypes: setFirstLast(abi.objectTypes),
      importedObjectTypes: setFirstLast(abi.importedObjectTypes),
      importedModuleTypes: setFirstLast(abi.importedModuleTypes),
      importedEnvTypes: setFirstLast(abi.importedEnvTypes),
    }),
  },
};

function setFirstLast<T>(array: T[] | undefined): T[] {
  return array
    ? array.map((item, index) => {
        if (typeof item === "object") {
          return {
            ...item,
            first: index === 0 ? true : null,
            last: index === array.length - 1 ? true : null,
          };
        } else {
          return item;
        }
      })
    : [];
}
