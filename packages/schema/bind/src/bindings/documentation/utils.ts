import {
  ImportedDefinition,
  MethodDefinition,
  TypeInfo,
} from "@web3api/schema-parse";

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

export function sortObjectsInPlaceByType(typeInfo: TypeInfo): void {
  const typesToSort: { type: string }[][] = [
    typeInfo.objectTypes,
    typeInfo.enumTypes,
    typeInfo.importedObjectTypes,
    typeInfo.importedEnumTypes,
  ];
  for (const definitions of typesToSort) {
    definitions.sort((a: { type: string }, b: { type: string }) =>
      a.type.localeCompare(b.type)
    );
  }
}

export function sortMethodsInPlaceByName(typeInfo: TypeInfo): void {
  const methodsToSort: MethodDefinition[][] = [];
  for (const moduleType of typeInfo.moduleTypes) {
    methodsToSort.push(moduleType.methods);
  }
  for (const moduleType of typeInfo.importedModuleTypes) {
    methodsToSort.push(moduleType.methods);
  }
  for (const definitions of methodsToSort) {
    definitions.sort((a: MethodDefinition, b: MethodDefinition) => {
      if (!a.name || !b.name) return 0;
      return a.name.localeCompare(b.name);
    });
  }
}
