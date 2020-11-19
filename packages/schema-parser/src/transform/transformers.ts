import { GenericTransformPredicate } from ".";
import { ArrayDefinition, ImportedObjectTypeDefinition, ImportedQueryTypeDefinition, MethodDefinition, ObjectTypeDefinition, PropertyDefinition, QueryTypeDefinition, ScalarDefinition, TypeDefinition } from "../types";
import { finalizeObjectType, finalizeQueryType } from "../visitors/utils";

export function transformObject(obj: ObjectTypeDefinition, predicate: GenericTransformPredicate): any {
  const transformed = Object.assign({}, obj);
  const addedFields: any = predicate(transformed);

  if (addedFields && typeof addedFields === "object") {
    Object.assign(transformed, addedFields);
  }

  const transformedProperties: any[] = [];
  for (const property of transformed.properties) {
    transformedProperties.push(transformProperty(property, predicate));
  }
  transformed.properties = transformedProperties;

  finalizeObjectType(transformed);

  return transformed;
}

export function transformImportedObject(obj: ImportedObjectTypeDefinition, predicate: GenericTransformPredicate): any {
  return transformObject(obj, predicate);
}

export function transformQuery(query: QueryTypeDefinition, predicate: GenericTransformPredicate): any {
  const transformed = Object.assign({}, query);
  const addedFields: any = predicate(transformed);

  if (addedFields && typeof addedFields === "object") {
    Object.assign(transformed, addedFields);
  }

  const transformedMethods: any[] = [];
  for (const method of transformed.methods) {
    transformedMethods.push(transformMethod(method, predicate));
  }
  transformed.methods = transformedMethods;

  finalizeQueryType(transformed);

  return transformed;
}

export function transformImportedQuery(query: ImportedQueryTypeDefinition, predicate: GenericTransformPredicate): any {
  return transformQuery(query, predicate);
}

function transformMethod(method: MethodDefinition, predicate: GenericTransformPredicate): any {
  const transformed = Object.assign({}, method);
  const addedFields: any = predicate(transformed);

  if (addedFields && typeof addedFields === "object") {
    Object.assign(transformed, addedFields);
  }

  const transformedArgs: any[] = [];
  for (const arg of transformed.arguments) {
    transformedArgs.push(transformProperty(arg, predicate));
  }
  transformed.arguments = transformedArgs;

  if (transformed.return) {
    transformed.return = transformProperty(transformed.return, predicate);
  }

  return transformed;
}

function transformProperty(property: PropertyDefinition, predicate: GenericTransformPredicate): any {
  const transformed = Object.assign({}, property);
  const addedFields: any = predicate(transformed);

  if (addedFields && typeof addedFields === "object") {
    Object.assign(transformed, addedFields);
  }

  if (transformed.array) {
    transformed.array = transformArray(transformed.array, predicate);
  }

  if (transformed.scalar) {
    transformed.scalar = transformScalar(transformed.scalar, predicate);
  }

  return transformed;
}

function transformArray(array: ArrayDefinition, predicate: GenericTransformPredicate): any {
  const transformed = Object.assign({}, array);
  const addedFields: any = predicate(transformed);

  if (addedFields && typeof addedFields === "object") {
    Object.assign(transformed, addedFields);
  }

  if (transformed.array) {
    transformed.array = transformArray(transformed.array, predicate);
  }

  if (transformed.scalar) {
    transformed.scalar = transformScalar(transformed.scalar, predicate);
  }

  return transformed;
}

function transformScalar(scalar: ScalarDefinition, predicate: GenericTransformPredicate): any {
  return transformGeneric(scalar, predicate);
}

function transformGeneric(type: TypeDefinition, predicate: GenericTransformPredicate): any {
  const transformed = Object.assign({}, type);
  const addedFields: any = predicate(transformed);

  if (addedFields && typeof addedFields === "object") {
    Object.assign(transformed, addedFields);
  }

  return transformed;
}