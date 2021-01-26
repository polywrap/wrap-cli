import { TypeInfoTransforms } from ".";
import {
  ArrayDefinition,
  GenericDefinition,
  PropertyDefinition,
} from "../typeInfo";

export const finalizePropertyDef: TypeInfoTransforms = {
  enter: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PropertyDefinition: (def: PropertyDefinition): PropertyDefinition => {
      populatePropertyType(def);
      return def;
    },
  },
};

function populatePropertyType(property: PropertyDefinition) {
  let propertyType: GenericDefinition | undefined;
  if (property.array) {
    populateArrayType(property.array);
    propertyType = property.array;
  } else if (property.scalar) {
    propertyType = property.scalar;
  } else if (property.object) {
    propertyType = property.object;
  } else {
    throw Error("Property type is undefined, this should never happen.");
  }

  property.type = propertyType.type;
  property.required = propertyType.required;
}

function populateArrayType(array: ArrayDefinition) {
  let baseTypeFound = false;

  let currentArray = array;
  while (!baseTypeFound) {
    if (currentArray.array) {
      currentArray = currentArray.array;
      populateArrayType(currentArray);
    } else if (currentArray.scalar || currentArray.object) {
      baseTypeFound = true;
    } else {
      throw Error(
        `This should never happen, ArrayDefinition is malformed.\n${JSON.stringify(
          array,
          null,
          2
        )}`
      );
    }
  }

  if (array.array) {
    array.item = array.array;
  } else if (array.scalar) {
    array.item = array.scalar;
  } else {
    array.item = array.object;
  }

  if (!array.item) {
    throw Error("Array isn't valid.");
  }

  array.type = "[" + array.item.type + "]";
}
