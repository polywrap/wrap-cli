import { ImportedObjectTypeDefinition, ImportedQueryTypeDefinition, ObjectTypeDefinition, QueryTypeDefinition, TypeDefinition, TypeInfo } from "../types";
import { transformImportedObject, transformImportedQuery, transformObject, transformQuery } from "./transformers";


/**
 * A Predicate should return any *ADDITIONAL* fields to add
 */
export type GenericTransformPredicate = (definition: TypeDefinition) => any;

export function transformTypeInfo(info: TypeInfo, predicate: GenericTransformPredicate): void {
  const transformedUserTypes: ObjectTypeDefinition[] = [];
  for (const type of info.userTypes) {
    const t = transformObject(type, predicate);
    transformedUserTypes.push(t);
  }
  info.userTypes = transformedUserTypes;

  const transformedImportedTypes: ImportedObjectTypeDefinition[] = [];
  for (const type of info.importObjectTypes) {
    const t = transformImportedObject(type, predicate);
    transformedImportedTypes.push(t);
  }
  info.importObjectTypes = transformedImportedTypes;

  const transformedQueryTypes: QueryTypeDefinition[] = [];
  for (const type of info.queryTypes) {
    const t = transformQuery(type, predicate);
    transformedQueryTypes.push(t);
  }
  info.queryTypes = transformedQueryTypes;

  const transformedImportedQueryTypes: ImportedQueryTypeDefinition[] = [];
  for (const type of info.importedQueryTypes) {
    const t = transformImportedQuery(type, predicate);
    transformedImportedQueryTypes.push(t);
  }
  info.importedQueryTypes = transformedImportedQueryTypes;
}
