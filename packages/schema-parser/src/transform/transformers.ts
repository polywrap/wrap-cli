import { GenericTransformPredicate } from ".";
import {
  ArrayDefinition,
  ImportedObjectDefinition,
  ImportedQueryDefinition,
  MethodDefinition,
  ObjectDefinition,
  PropertyDefinition,
  QueryDefinition,
  ScalarDefinition,
  GenericDefinition
} from "../typeInfo";
import {
  finalizeObjectType,
  finalizeQueryType
} from "../visitors/utils";

export function transformObject(type: ObjectDefinition, predicate: GenericTransformPredicate): ObjectDefinition {
  const transformed = execPredicate(type, predicate)

  const transformedProperties: PropertyDefinition[] = [];
  for (const property of transformed.properties) {
    transformedProperties.push(transformProperty(property, predicate));
  }
  transformed.properties = transformedProperties;

  finalizeObjectType(transformed);

  return transformed;
}

export function transformImportedObject(type: ImportedObjectDefinition, predicate: GenericTransformPredicate): ImportedObjectDefinition {
  return transformObject(type, predicate) as ImportedObjectDefinition;
}

export function transformQuery(type: QueryDefinition, predicate: GenericTransformPredicate): QueryDefinition {
  const transformed = execPredicate(type, predicate);

  const transformedMethods: MethodDefinition[] = [];
  for (const method of transformed.methods) {
    transformedMethods.push(transformMethod(method, predicate));
  }
  transformed.methods = transformedMethods;

  finalizeQueryType(transformed);

  return transformed;
}

export function transformImportedQuery(type: ImportedQueryDefinition, predicate: GenericTransformPredicate): ImportedQueryDefinition {
  return transformQuery(type, predicate) as ImportedQueryDefinition;
}

function transformMethod(type: MethodDefinition, predicate: GenericTransformPredicate): MethodDefinition {
  const transformed = execPredicate(type, predicate);

  const transformedArgs: PropertyDefinition[] = [];
  for (const arg of transformed.arguments) {
    transformedArgs.push(
      transformProperty(arg, predicate)
    );
  }
  transformed.arguments = transformedArgs;

  if (transformed.return) {
    transformed.return = transformProperty(transformed.return, predicate);
  }

  return transformed;
}

function transformProperty(type: PropertyDefinition, predicate: GenericTransformPredicate): PropertyDefinition {
  const transformed = execPredicate(type, predicate);

  if (transformed.array) {
    transformed.array = transformArray(transformed.array, predicate);
  }

  if (transformed.scalar) {
    transformed.scalar = transformScalar(transformed.scalar, predicate);
  }

  return transformed;
}

function transformArray(type: ArrayDefinition, predicate: GenericTransformPredicate): ArrayDefinition {
  const transformed = execPredicate(type, predicate);

  if (transformed.array) {
    transformed.array = transformArray(transformed.array, predicate);
  }

  if (transformed.scalar) {
    transformed.scalar = transformScalar(transformed.scalar, predicate);
  }

  return transformed;
}

function transformScalar(scalar: ScalarDefinition, predicate: GenericTransformPredicate): ScalarDefinition {
  return execPredicate(scalar, predicate);
}

function transformGeneric(type: GenericDefinition, predicate: GenericTransformPredicate): GenericDefinition {
  return execPredicate(type, predicate);
}

function execPredicate<T extends GenericDefinition>(
  type: T, predicate: GenericTransformPredicate
): T {
  const transformed = Object.assign({}, type);
  const addedFields: any = predicate(transformed);

  if (addedFields && typeof addedFields === "object") {
    Object.assign(transformed, addedFields);
  }

  return transformed;
}
