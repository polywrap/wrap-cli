import { AbiTransforms } from ".";

export const addFirstLast: AbiTransforms = {
  enter: {
    DefinitionOrType: (def) => {
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
    Abi: (abi) => ({
      ...abi,
      objectTypes: setFirstLast(abi.objects),
      // TODO: why only local objects?
      // importedObjectTypes: setFirstLast(abi.importedObjectTypes),
      // importedModuleTypes: setFirstLast(abi.importedModuleTypes),
      // importedEnvTypes: setFirstLast(abi.importedEnvTypes),
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
