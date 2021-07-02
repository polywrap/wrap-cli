import { TypeInfoTransforms } from ".";
import {
  ArrayDefinition,
  createEnumRef,
  createObjectRef,
  GenericDefinition,
  PropertyDefinition,
  TypeInfo,
} from "../typeInfo";

export const finalizePropertyDef = (typeInfo: TypeInfo): TypeInfoTransforms => {
  return {
    enter: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      PropertyDefinition: (def: PropertyDefinition): PropertyDefinition => {
        populatePropertyType(def, typeInfo);
        return def;
      },
    },
  };
};

export function populatePropertyType(
  property: PropertyDefinition,
  typeInfo: TypeInfo
): void {
  let propertyType: GenericDefinition | undefined;
  if (property.array) {
    populateArrayType(property.array, typeInfo);
    propertyType = property.array;
  } else if (property.unresolvedObjectOrEnum) {
    propertyType = resolveObjectOrEnumKind(property, typeInfo);
  } else if (property.scalar) {
    propertyType = property.scalar;
  } else if (property.object) {
    propertyType = property.object;
  } else if (property.enum) {
    propertyType = property.enum;
  } else {
    throw Error("Property type is undefined, this should never happen.");
  }

  property.type = propertyType.type;
  property.required = propertyType.required;
}

function populateArrayType(array: ArrayDefinition, typeInfo: TypeInfo) {
  let baseTypeFound = false;

  let currentArray = array;
  while (!baseTypeFound) {
    if (currentArray.array) {
      currentArray = currentArray.array;
      populateArrayType(currentArray, typeInfo);
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
    array.item = resolveObjectOrEnumKind(array, typeInfo);
  } else if (array.scalar) {
    array.item = array.scalar;
  } else if (array.enum) {
    array.item = array.enum;
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
  typeInfo: TypeInfo
): GenericDefinition {
  if (!property.unresolvedObjectOrEnum) {
    throw Error("Type reference is undefined, this should never happen.");
  }

  // Check to see if the type is a part of the custom types defined inside the schema (objects, enums)
  let customType: GenericDefinition | undefined = typeInfo.objectTypes.find(
    (type) => type.type === property.unresolvedObjectOrEnum!.type
  );

  customType = customType
    ? customType
    : typeInfo.importedObjectTypes.find(
        (type) => type.type === property.unresolvedObjectOrEnum!.type
      );

  if (!customType) {
    customType = typeInfo.enumTypes.find(
      (type) => type.type === property.unresolvedObjectOrEnum!.type
    );

    customType = customType
      ? customType
      : typeInfo.importedEnumTypes.find(
          (type) => type.type === property.unresolvedObjectOrEnum!.type
        );

    if (!customType) {
      throw new Error(
        `Unsupported type ${property.unresolvedObjectOrEnum.type}`
      );
    }

    property.enum = createEnumRef({
      name: property.unresolvedObjectOrEnum.name,
      required: property.unresolvedObjectOrEnum.required ?? undefined,
      type: property.unresolvedObjectOrEnum.type,
    });

    property.unresolvedObjectOrEnum = null;

    return property.enum;
  } else {
    property.object = createObjectRef({
      name: property.unresolvedObjectOrEnum.name,
      required: property.unresolvedObjectOrEnum.required ?? undefined,
      type: property.unresolvedObjectOrEnum.type,
    });

    property.unresolvedObjectOrEnum = null;

    return property.object;
  }
}
