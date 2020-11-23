import {
  ObjectDefinition,
  QueryDefinition,
  ImportedQueryDefinition,
  ImportedObjectDefinition,
  GenericDefinition
} from "./definitions";

export * from "./definitions";

import deepEqual from "deep-equal";

export interface TypeInfo {
  userTypes: ObjectDefinition[];
  queryTypes: QueryDefinition[];
  importedObjectTypes: ImportedObjectDefinition[];
  importedQueryTypes: ImportedQueryDefinition[];
}
export function createTypeInfo(): TypeInfo {
  return {
    userTypes: [],
    queryTypes: [],
    importedObjectTypes: [],
    importedQueryTypes: []
  }
}

export function combineTypeInfo(typeInfos: TypeInfo[]): TypeInfo {
  const combined: TypeInfo = {
    userTypes: [],
    queryTypes: [],
    importedObjectTypes: [],
    importedQueryTypes: []
  };

  const compareImportedType = (a: any, b: any) => {
    return a.uri === b.uri && a.name === b.name;
  }

  for (const typeInfo of typeInfos) {
    for (const userType of typeInfo.userTypes) {
      tryInsert(combined.userTypes, userType);
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
  compare: (a: GenericDefinition, b: GenericDefinition) => boolean = (a, b) => a.name === b.name
) => {
  const index = dest.findIndex((item: GenericDefinition) =>
    compare(item, value)
  );

  if (index > -1) {
    // See if they're the same, error if they aren't
    if (!deepEqual(dest[index], value)) {
      throw Error(
        `combineTypeInfo found two types by the same name that are not equivalent.\n` +
        `Name: "${value.name}"\nObject A: ${JSON.stringify(dest[index])}\n` +
        `Object B: ${JSON.stringify(value)}`
      );
    }
  } else {
    dest.push(value);
  }
}
