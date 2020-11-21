import { TypeInfoTransforms } from ".";
import {
  ArrayDefinition,
  GenericDefinition,
  PropertyDefinition
} from "../typeInfo";

export const finalizePropertyDef: TypeInfoTransforms = {
  enter: {
    PropertyDefinition: (def: PropertyDefinition) => {
      populatePropertyType(def);
      return def;
    }
  }
}

function populatePropertyType(property: PropertyDefinition) {
  let propertyType: GenericDefinition | undefined;
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
    } else {
      throw Error(
        `This should never happen, ArrayDefinition is malformed.\n${JSON.stringify(array, null, 2)}`
      );
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

