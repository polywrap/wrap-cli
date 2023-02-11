import { DocumentNode, TypeNode, visit } from "graphql";
import { isModuleType, isScalarType } from "../abi/utils";
import { UniqueDefKind, RefType, AnyType, MapKeyTypeName, mapKeyTypeSet, MapType, ScalarTypeName, ArrayType, ScalarType } from "../definitions";

export const extractType = (node: TypeNode, uniqueDefs: Map<string, UniqueDefKind>): AnyType => {
  switch (node.kind) {
    case "NonNullType":
      return extractType(node.type, uniqueDefs)
    case "ListType":
      return {
        kind: "Array",
        item: {
          required: node.type.kind === "NonNullType",
          type: extractType(node.type, uniqueDefs)
        }
      }
    case "NamedType":
      if (isScalarType(node.name.value)) {
        return {
          kind: "Scalar",
          scalar: node.name.value as ScalarTypeName
        }
      }

      return parseRef(node.name.value, uniqueDefs)
  }
}

export const parseRef = (refName: string, uniqueDefs: Map<string, UniqueDefKind>): RefType => {
  const kind = uniqueDefs.get(refName);

  if (!kind) {
    throw new Error(`Found ref to unknown definition '${refName}'`)
  }

  return {
    kind: "Ref",
    ref_kind: kind,
    ref_name: refName
  }
}

// TODO: Make sure map also works for imported types and modules

const extractRequired = (typeString: string): { required: boolean, innerString: string } => {
  const required = typeString.endsWith("!");

  return {
    required: required,
    innerString: required ? typeString.slice(0, -1) : typeString
  }
}

const parseScalarString = (scalarString: string): ScalarType => {
  return {
    kind: "Scalar",
    scalar: scalarString as ScalarTypeName,
  }
}

const parseRefString = (refString: string, uniqueDefs: Map<string, UniqueDefKind>): RefType => {
  const ref_kind = uniqueDefs.get(refString);

  if (!ref_kind) {
    throw new Error(`Found ref to unknown definition '${refString}'`)
  }

  return {
    kind: "Ref",
    ref_kind,
    ref_name: refString
  }
}

export const parseArrayString = (arrayString: string, uniqueDefs: Map<string, UniqueDefKind>): ArrayType => {
  if (!arrayString.startsWith("[") || !arrayString.endsWith("]")) {
    throw new Error(`Invalid array type: ${arrayString}`);
  }

  const { required: isInnerTypeRequired, innerString: innerTypeString } = extractRequired(arrayString.slice(1, -1));

  const trimmedInnerTypeString = innerTypeString.trim();
  let innerType: AnyType;

  if (isArray(trimmedInnerTypeString)) {
    innerType = parseArrayString(trimmedInnerTypeString, uniqueDefs)
  } else if (isMap(trimmedInnerTypeString)) {
    innerType = parseMapString(trimmedInnerTypeString, uniqueDefs)
  } else if (isScalarType(trimmedInnerTypeString)) {
    innerType = parseScalarString(trimmedInnerTypeString)
  } else {
    innerType = parseRefString(trimmedInnerTypeString, uniqueDefs)
  }

  const item = {
    required: isInnerTypeRequired,
    type: innerType
  }

  return {
    kind: "Array",
    item
  }
}

export const parseMapString = (mapString: string, uniqueDefs: Map<string, UniqueDefKind>): MapType => {
  if (!mapString.startsWith("Map<") || !mapString.endsWith(">")) {
    throw new Error(`Invalid map value type: ${mapString}`);
  }

  const innerMapString = mapString.slice(4, -1);
  const trimmedInnerMapString = innerMapString.trim();

  if (!trimmedInnerMapString.includes(",")) {
    throw new Error(`Invalid map value type: ${mapString}`);
  }

  const mapStringSplit = trimmedInnerMapString.split(",");
  const trimmedKeyString = mapStringSplit[0].trim();
  const trimmedValString = mapStringSplit.slice(1).join(",").trim();

  // If key contains !, remove it. It will always be required anyways
  const innerKeyString = trimmedKeyString.endsWith("!") ? trimmedKeyString.slice(0, -1) : trimmedKeyString;

  if (!isMapKey(innerKeyString)) {
    throw new Error(
      `Found invalid map key type: ${innerKeyString} while parsing ${mapString}`
    );
  }

  const key = {
    kind: "Scalar" as const,
    scalar: innerKeyString as MapKeyTypeName
  }

  const { required: isValueRequired, innerString: innerValueString } = extractRequired(trimmedValString);
  const trimmedInnerValueString = innerValueString.trim();

  let valueType: AnyType;

  if (isArray(trimmedInnerValueString)) {
    valueType = parseArrayString(trimmedInnerValueString, uniqueDefs)
  } else if (isMap(trimmedInnerValueString)) {
    valueType = parseMapString(trimmedInnerValueString, uniqueDefs)
  } else if (isScalarType(trimmedInnerValueString)) {
    valueType = parseScalarString(trimmedInnerValueString)
  } else {
    valueType = parseRef(trimmedInnerValueString, uniqueDefs)
  }

  const value = {
    type: valueType,
    required: isValueRequired,
  }

  return {
    kind: "Map",
    key,
    value
  }
}

const isMap = (typeName: string): boolean => {
  return typeName.startsWith("Map<")
}

const isMapKey = (typeName: string): boolean => {
  return typeName in mapKeyTypeSet;
}

const isArray = (typeName: string): boolean => {
  return typeName.startsWith("[")
}

export const extractUniqueDefinitionNames = (document: DocumentNode): Map<string, UniqueDefKind> => {
  const uniqueDefs = new Map<string, UniqueDefKind>();

  visit(document, {
    ObjectTypeDefinition: (node) => {
      const name = node.name.value;

      if (!isModuleType(name)) {
        uniqueDefs.set(name, "Object")
      }
    },
    EnumTypeDefinition: (node) => {
      uniqueDefs.set(node.name.value, "Enum")
    }
  });

  return uniqueDefs;
}
