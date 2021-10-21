import { TypeInfoTransforms } from ".";
import {
  ArrayDefinition,
  createEnumRef,
  createObjectRef,
  createUnionRef,
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
  } else if (property.unresolvedObjectOrUnionOrEnum) {
    propertyType = resolveObjectOrUnionOrEnumKind(property, typeInfo);
  } else if (property.scalar) {
    propertyType = property.scalar;
  } else if (property.object) {
    propertyType = property.object;
  } else if (property.enum) {
    propertyType = property.enum;
  } else if (property.union) {
    propertyType = property.union;
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
      currentArray.union ||
      currentArray.unresolvedObjectOrUnionOrEnum
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
  } else if (array.unresolvedObjectOrUnionOrEnum) {
    array.item = resolveObjectOrUnionOrEnumKind(array, typeInfo);
  } else if (array.scalar) {
    array.item = array.scalar;
  } else if (array.enum) {
    array.item = array.enum;
  } else if (array.union) {
    array.item = array.union;
  } else {
    array.item = array.object;
  }

  if (!array.item) {
    throw Error("Array isn't valid.");
  }

  array.type = "[" + array.item.type + "]";
}

function resolveObjectOrUnionOrEnumKind(
  property: PropertyDefinition,
  typeInfo: TypeInfo
): GenericDefinition {
  if (!property.unresolvedObjectOrUnionOrEnum) {
    throw Error("Type reference is undefined, this should never happen.");
  }

  // Check to see if the type is a part of the custom types defined inside the schema (objects, enums, unions)
  const objectType = typeInfo.objectTypes.find(
    (type) => type.type === property.unresolvedObjectOrUnionOrEnum!.type
  );

  const importedObjectType = typeInfo.importedObjectTypes.find(
    (type) => type.type === property.unresolvedObjectOrUnionOrEnum!.type
  );

  const objectCustomType = objectType || importedObjectType;

  const enumType = typeInfo.enumTypes.find(
    (type) => type.type === property.unresolvedObjectOrUnionOrEnum!.type
  );

  const importedEnumType = typeInfo.importedEnumTypes.find(
    (type) => type.type === property.unresolvedObjectOrUnionOrEnum!.type
  );

  const enumCustomType = enumType || importedEnumType;

  const unionType = typeInfo.unionTypes.find(
    (type) => type.type === property.unresolvedObjectOrUnionOrEnum!.type
  );

  const importedUnionType = typeInfo.importedUnionTypes.find(
    (type) => type.type === property.unresolvedObjectOrUnionOrEnum!.type
  );

  const unionCustomType = unionType || importedUnionType;

  if (objectCustomType) {
    property.object = createObjectRef({
      name: property.unresolvedObjectOrUnionOrEnum.name,
      required: property.unresolvedObjectOrUnionOrEnum.required ?? undefined,
      type: property.unresolvedObjectOrUnionOrEnum.type,
    });

    property.unresolvedObjectOrUnionOrEnum = null;

    return property.object;
  } else if (enumCustomType) {
    property.enum = createEnumRef({
      name: property.unresolvedObjectOrUnionOrEnum.name,
      required: property.unresolvedObjectOrUnionOrEnum.required ?? undefined,
      type: property.unresolvedObjectOrUnionOrEnum.type,
    });

    property.unresolvedObjectOrUnionOrEnum = null;

    return property.enum;
  } else if (unionCustomType) {
    property.union = createUnionRef({
      name: property.unresolvedObjectOrUnionOrEnum.name,
      required: property.unresolvedObjectOrUnionOrEnum.required ?? undefined,
      type: property.unresolvedObjectOrUnionOrEnum.type,
    });

    property.unresolvedObjectOrUnionOrEnum = null;

    return property.union;
  } else {
    console.log(JSON.stringify(property, null, 2));
    console.log("----------------");
    console.log(unionCustomType);
    console.log("----------------");
    console.log(JSON.stringify(typeInfo, null, 2));
    throw new Error(
      `Unsupported type ${property.unresolvedObjectOrUnionOrEnum.type}`
    );
  }
}
