import {
  ObjectDefinition,
  ImportedObjectDefinition,
  ImportedQueryDefinition,
  QueryDefinition
} from "./definitions";

export * from "./definitions";
export * from "./visitor";

export interface TypeInfo {
  userTypes: ObjectDefinition[];
  importObjectTypes: ImportedObjectDefinition[];
  importedQueryTypes: ImportedQueryDefinition[];
  queryTypes: QueryDefinition[];
}
export function createTypeInfo(): TypeInfo {
  return {
    userTypes: [],
    importObjectTypes: [],
    importedQueryTypes: [],
    queryTypes: []
  }
}
