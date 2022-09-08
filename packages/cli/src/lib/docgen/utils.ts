import {
  ImportedDefinition,
  MethodDefinition,
  Abi,
  GenericDefinition,
} from "@polywrap/schema-parse";

export function arrangeByNamespace<T extends ImportedDefinition>(
  definitions: Array<T>
): Record<string, Array<T>> {
  const result: Record<string, Array<T>> = {};
  for (const val of definitions) {
    if (!result[val.namespace]) {
      result[val.namespace] = new Array<T>();
    }
    result[val.namespace].push(val);
  }
  return result;
}

export function sortObjectsInPlaceByType(abi: Abi): void {
  const typesToSort: (GenericDefinition[] | undefined)[] = [
    abi.objectTypes,
    abi.enumTypes,
    abi.importedObjectTypes,
    abi.importedEnumTypes,
  ];
  for (const definitions of typesToSort) {
    if (definitions) {
      definitions.sort((a: { type: string }, b: { type: string }) =>
        a.type.localeCompare(b.type)
      );
    }
  }
}

export function sortMethodsInPlaceByName(abi: Abi): void {
  const methodsToSort: MethodDefinition[][] = [];
  if (abi.moduleType && abi.moduleType.methods) {
    methodsToSort.push(abi.moduleType.methods);
  }
  if (abi.importedModuleTypes) {
    for (const moduleType of abi.importedModuleTypes) {
      if (moduleType.methods) {
        methodsToSort.push(moduleType.methods);
      }
    }
  }

  for (const definitions of methodsToSort) {
    definitions.sort((a: MethodDefinition, b: MethodDefinition) => {
      if (!a.name || !b.name) return 0;
      return a.name.localeCompare(b.name);
    });
  }
}
