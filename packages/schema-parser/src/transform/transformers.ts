import { GenericTransformPredicate } from ".";
import { ArrayDefinition, ImportedObjectTypeDefinition, ImportedQueryTypeDefinition, MethodDefinition, ObjectTypeDefinition, PropertyDefinition, QueryTypeDefinition, ScalarDefinition, TypeDefinition } from "../types";
import { finalizeObjectType, finalizeQueryType } from "../visitors/utils";

export function transformObject(obj: ObjectTypeDefinition, predicate: GenericTransformPredicate): any {
  let transformed = obj;
  const addedFields: any = predicate(obj);

  if (addedFields && typeof addedFields === "object") {
    transformed = Object.assign({}, obj, addedFields);
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
  let transformed = query;
  const addedFields: any = predicate(query);

  if (addedFields && typeof addedFields === "object") {
    transformed = Object.assign({}, query, addedFields);
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
  let transformed = method;
  const addedFields: any = predicate(method);

  if (addedFields && typeof addedFields === "object") {
    transformed = Object.assign({}, method, addedFields);
  }

  const transformedArgs: any[] = [];
  for (const arg of transformed.arguments) {
    transformedArgs.push(transformProperty(arg, predicate));
  }

  if (transformed.return) {
    transformed.return = transformProperty(transformed.return, predicate);
  }
}

function transformProperty(property: PropertyDefinition, predicate: GenericTransformPredicate): any {
  let transformed = property;
  const addedFields: any = predicate(property);

  if (addedFields && typeof addedFields === "object") {
    transformed = Object.assign({}, property, addedFields);
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
  let transformed = array;
  const addedFields: any = predicate(array);

  if (addedFields && typeof addedFields === "object") {
    transformed = Object.assign({}, array, addedFields);
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
  let transformed = type;
  const addedFields: any = predicate(type);

  if (addedFields && typeof addedFields === "object") {
    transformed = Object.assign({}, type, addedFields);
  }

  return transformed;
}