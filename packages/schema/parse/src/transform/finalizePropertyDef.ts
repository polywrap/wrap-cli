import { AbiTransforms } from ".";
import { createEnumRef, createObjectRef } from "../abi";

import {
  AnyDefinition,
  ArrayDefinition,
  GenericDefinition,
  MapDefinition,
  PropertyDefinition,
  WrapAbi,
} from "@polywrap/wrap-manifest-types-js";

export const finalizePropertyDef = (abi: WrapAbi): AbiTransforms => {
  return {
    enter: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      PropertyDefinition: (def: PropertyDefinition): PropertyDefinition => {
        populatePropertyType(def, abi);
        return def;
      },
    },
  };
};

export function populatePropertyType(
  property: PropertyDefinition,
  abi: WrapAbi
): void {
  let propertyType: GenericDefinition | undefined;
  if (property.array) {
    populateArrayType(property.array, abi);
    propertyType = property.array;
  } else if (property.unresolvedObjectOrEnum) {
    propertyType = resolveObjectOrEnumKind(property, abi);
  } else if (property.scalar) {
    propertyType = property.scalar;
  } else if (property.object) {
    propertyType = property.object;
  } else if (property.enum) {
    propertyType = property.enum;
  } else if (property.map) {
    populateMapType(property.map, abi);
    propertyType = property.map;
  } else {
    throw Error("Property type is undefined, this should never happen.");
  }

  property.type = propertyType.type;
  property.required = propertyType.required;
}

function populateMapType(map: MapDefinition, abi: WrapAbi) {
  let baseTypeFound = false;

  let currentType: AnyDefinition = map;
  while (!baseTypeFound) {
    if (currentType.map) {
      currentType = currentType.map;
      populateMapType(currentType as MapDefinition, abi);
    } else if (currentType.array) {
      currentType = currentType.array;
      populateArrayType(currentType as ArrayDefinition, abi);
    } else if (
      currentType.scalar ||
      currentType.object ||
      currentType.enum ||
      currentType.unresolvedObjectOrEnum
    ) {
      baseTypeFound = true;
    } else {
      throw Error(
        `This should never happen, MapDefinition is malformed.\n${JSON.stringify(
          map,
          null,
          2
        )}`
      );
    }
  }

  if (map.array) {
    map.value = map.array;
  } else if (map.unresolvedObjectOrEnum) {
    map.value = resolveObjectOrEnumKind(map, abi);
  } else if (map.scalar) {
    map.value = map.scalar;
  } else if (map.enum) {
    map.value = map.enum;
  } else if (map.map) {
    map.value = map.map;
  } else {
    map.value = map.object;
  }

  if (!map.value) {
    throw Error("Map isn't valid.");
  }
}

function populateArrayType(array: ArrayDefinition, abi: WrapAbi) {
  let baseTypeFound = false;

  let currentArray = array;
  while (!baseTypeFound) {
    if (currentArray.array) {
      currentArray = currentArray.array;
      populateArrayType(currentArray, abi);
    } else if (
      currentArray.scalar ||
      currentArray.object ||
      currentArray.enum ||
      currentArray.unresolvedObjectOrEnum
    ) {
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
  } else if (array.unresolvedObjectOrEnum) {
    array.item = resolveObjectOrEnumKind(array, abi);
  } else if (array.scalar) {
    array.item = array.scalar;
  } else if (array.enum) {
    array.item = array.enum;
  } else if (array.map) {
    array.item = array.map;
  } else {
    array.item = array.object;
  }

  if (!array.item) {
    throw Error("Array isn't valid.");
  }

  array.type = "[" + array.item.type + "]";
}

function resolveObjectOrEnumKind(
  property: PropertyDefinition,
  abi: WrapAbi
): GenericDefinition {
  if (!property.unresolvedObjectOrEnum) {
    throw Error("Type reference is undefined, this should never happen.");
  }

  const unresolved = property.unresolvedObjectOrEnum;

  // Check to see if the type is a part of the custom types defined inside the schema (objects, enums, envs)
  let customType: GenericDefinition | undefined =
    abi.objectTypes &&
    abi.objectTypes.find((type) => type.type === unresolved.type);

  customType = customType
    ? customType
    : abi.importedObjectTypes &&
      abi.importedObjectTypes.find((type) => type.type === unresolved.type);

  const envType = abi.envType;
  customType = customType
    ? customType
    : envType?.type === unresolved.type
    ? envType
    : undefined;

  customType = customType
    ? customType
    : abi.importedEnvTypes &&
      abi.importedEnvTypes.find((type) => type.type === unresolved.type);

  if (!customType) {
    customType =
      abi.enumTypes &&
      abi.enumTypes.find((type) => type.type === unresolved.type);

    customType = customType
      ? customType
      : abi.importedEnumTypes &&
        abi.importedEnumTypes.find((type) => type.type === unresolved.type);

    if (!customType) {
      throw new Error(`Unsupported type ${unresolved.type}`);
    }

    property.enum = createEnumRef({
      name: unresolved.name,
      required: unresolved.required ?? undefined,
      type: unresolved.type,
    });

    property.unresolvedObjectOrEnum = undefined;

    return property.enum;
  } else {
    property.object = createObjectRef({
      name: property.unresolvedObjectOrEnum.name,
      required: property.unresolvedObjectOrEnum.required ?? undefined,
      type: property.unresolvedObjectOrEnum.type,
    });

    property.unresolvedObjectOrEnum = undefined;

    return property.object;
  }
}
