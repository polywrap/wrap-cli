import {
  ImportedObjectDefinition,
  ImportedQueryDefinition,
  ObjectDefinition,
  QueryDefinition,
  GenericDefinition,
  TypeInfo
} from "../typeInfo";
import { transformImportedObject, transformImportedQuery, transformObject, transformQuery } from "./transformers";

/**
 * A Predicate should return any *ADDITIONAL* fields to add
 */
export type GenericTransformPredicate = (definition: GenericDefinition) => any;

export function transformTypeInfo(info: TypeInfo, predicate: GenericTransformPredicate): void {
  const transformedUserTypes: ObjectDefinition[] = [];
  for (const type of info.userTypes) {
    const t = transformObject(type, predicate);
    transformedUserTypes.push(t);
  }
  info.userTypes = transformedUserTypes;

  const transformedImportedTypes: ImportedObjectDefinition[] = [];
  for (const type of info.importObjectTypes) {
    const t = transformImportedObject(type, predicate);
    transformedImportedTypes.push(t);
  }
  info.importObjectTypes = transformedImportedTypes;

  const transformedQueryTypes: QueryDefinition[] = [];
  for (const type of info.queryTypes) {
    const t = transformQuery(type, predicate);
    transformedQueryTypes.push(t);
  }
  info.queryTypes = transformedQueryTypes;

  const transformedImportedQueryTypes: ImportedQueryDefinition[] = [];
  for (const type of info.importedQueryTypes) {
    const t = transformImportedQuery(type, predicate);
    transformedImportedQueryTypes.push(t);
  }
  info.importedQueryTypes = transformedImportedQueryTypes;
}
