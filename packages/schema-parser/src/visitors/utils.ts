import { ArrayDefinition, ObjectTypeDefinition, PropertyDefinition, TypeDefinition } from "..";
import { MethodDefinition, QueryTypeDefinition } from "../types";

export function finalizeObjectType(obj: ObjectTypeDefinition) {
  for (const property of obj.properties) {
    populatePropertyType(property);
  }
}

export function finalizeQueryType(query: QueryTypeDefinition) {
  for (const method of query.methods) {
    finalizeMethodType(method);
  }
}

function populatePropertyType(property: PropertyDefinition) {
  let propertyType: Maybe<TypeDefinition>;
  if (property.array) {
    populateArrayType(property.array);
    propertyType = property.array;
  } else if (property.scalar) {
    propertyType = property.scalar;
  } else {
    // Error case
    return;
  }

  property.type = propertyType.type;
  property.required = propertyType.required
}


function populateArrayType(array: ArrayDefinition) {
  let baseTypeFound = false;

  let currentArray = array;
  while (!baseTypeFound) {
    if (currentArray.array) {
      currentArray = currentArray.array;
      populateArrayType(currentArray);
    } else if (currentArray.scalar) {
      baseTypeFound = true;
    }
  }

  if (array.array) {
    array.item = array.array;
  } else {
    array.item = array.scalar;
  }

  if (!array.item) {
    throw Error("Array isn't valid.");
  }

  const modifier = array.required ? "" : "?";
  array.type = modifier + "[" + array.item.type + "]";
}

function finalizeMethodType(method: MethodDefinition) {
  for (const arg of method.arguments) {
    populatePropertyType(arg);
  }

  if (method.return) {
    populatePropertyType(method.return);
  }
}

