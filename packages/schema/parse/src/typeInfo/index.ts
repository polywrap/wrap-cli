import {
  ObjectDefinition,
  QueryDefinition,
  ImportedQueryDefinition,
  ImportedObjectDefinition,
  GenericDefinition,
} from "./definitions";

export * from "./definitions";
export * from "./scalar";
export * from "./operation";
export * from "./query";

export interface TypeInfo {
  objectTypes: ObjectDefinition[];
  queryTypes: QueryDefinition[];
  importedObjectTypes: ImportedObjectDefinition[];
  importedQueryTypes: ImportedQueryDefinition[];
}
export function createTypeInfo(): TypeInfo {
  return {
    objectTypes: [],
    queryTypes: [],
    importedObjectTypes: [],
    importedQueryTypes: [],
  };
}

type ImportedDefinition = ImportedObjectDefinition | ImportedQueryDefinition;

export function combineTypeInfo(typeInfos: TypeInfo[]): TypeInfo {
  const combined: TypeInfo = {
    objectTypes: [],
    queryTypes: [],
    importedObjectTypes: [],
    importedQueryTypes: [],
  };

  const compareImportedType = (
    a: ImportedDefinition,
    b: ImportedDefinition
  ) => {
    return a.uri === b.uri && a.nativeType === b.nativeType;
  };

  for (const typeInfo of typeInfos) {
    for (const objectType of typeInfo.objectTypes) {
      tryInsert(combined.objectTypes, objectType);
    }

    for (const queryType of typeInfo.queryTypes) {
      tryInsert(combined.queryTypes, queryType);
    }

    for (const importedObjectType of typeInfo.importedObjectTypes) {
      tryInsert(
        combined.importedObjectTypes,
        importedObjectType,
        compareImportedType
      );
    }

    for (const importedQueryType of typeInfo.importedQueryTypes) {
      tryInsert(
        combined.importedQueryTypes,
        importedQueryType,
        compareImportedType
      );
    }
  }

  return combined;
}

const tryInsert = (
  dest: GenericDefinition[],
  value: GenericDefinition,
  compare: (a: GenericDefinition, b: GenericDefinition) => boolean = (a, b) =>
    a.type === b.type
) => {
  const index = dest.findIndex((item: GenericDefinition) =>
    compare(item, value)
  );

  if (index > -1) {
    // See if they're the same, error if they aren't
    const destType = JSON.stringify(dest[index]);
    const valueType = JSON.stringify(value);
    if (destType !== valueType) {
      throw Error(
        `combineTypeInfo found two types by the same type that are not equivalent.\n` +
          `Type: "${value.type}"\nObject A: ${destType}\nObject B: ${valueType}`
      );
    }
  } else {
    dest.push(value);
  }
};
