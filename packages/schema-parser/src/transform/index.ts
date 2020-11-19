import { ImportedObjectTypeDefinition, ImportedQueryTypeDefinition, ObjectTypeDefinition, QueryTypeDefinition, TypeDefinition, TypeInfo } from "../types";
import { transformImportedObject, transformImportedQuery, transformObject, transformQuery } from "./transformers";


export type PredicateReturn = any;
export type GenericTransformPredicate = (definition: TypeDefinition) => PredicateReturn;

// export type TypedTransformPredicate<T extends TypeDefinition> = (definition: T) => any;
// export type TypedTransformPredicates = {
//   //Generic?: TypedTransformPredicate<TypeDefinition>,
//   Object?: TypedTransformPredicate<ObjectTypeDefinition>,
//   Any?: TypedTransformPredicate<AnyTypeDefinition>,
//   Scalar?: TypedTransformPredicate<ScalarDefinition>,
//   Array?: TypedTransformPredicate<ArrayDefinition>,
//   Property?: TypedTransformPredicate<PropertyDefinition>,
//   Method?: TypedTransformPredicate<MethodDefinition>,
//   Query?: TypedTransformPredicate<QueryTypeDefinition>,
//   ImportedQuery?: TypedTransformPredicate<ImportedQueryTypeDefinition>,
//   ImportedObject?: TypedTransformPredicate<ImportedObjectTypeDefinition>,
// }

export function transform(info: TypeInfo, predicate: GenericTransformPredicate) {
  transformGeneric(info, predicate);
}

function transformGeneric(info: TypeInfo, predicate: GenericTransformPredicate) {
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
