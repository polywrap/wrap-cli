import {
  ObjectDefinition,
  QueryDefinition,
  ImportedQueryDefinition,
  ImportedObjectDefinition
} from "./definitions";

export * from "./definitions";

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
