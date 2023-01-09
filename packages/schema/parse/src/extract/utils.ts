import { isScalarType, TypeNode } from "graphql";
import { UniqueDefKind, RefType, AnyType, MapKeyTypeName, mapKeyTypeSet, MapType, ScalarTypeName } from "../definitions";

export const extractType = (node: TypeNode, uniqueDefs: Map<string, UniqueDefKind>): AnyType => {
  switch (node.kind) {
    case "NonNullType":
      return extractType(node.type, uniqueDefs)
    case "ListType":
      return {
        kind: "Array",
        required: node.type.kind === "NonNullType",
        item: extractType(node.type, uniqueDefs)
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

export const parseMapString = (mapString: string, uniqueDefs: Map<string, UniqueDefKind>): MapType => {
  const extractType = (mapString: string): AnyType => {
    if (isArray(mapString)) {
      const closeSquareBracketIdx = mapString.lastIndexOf("]");
      const required = mapString[closeSquareBracketIdx + 1] === "!"
      return {
        kind: "Array",
        required,
        item: extractType(mapString.substring(1, closeSquareBracketIdx))
      };
    } else if (isMap(mapString)) {
      return parseMapString(mapString, uniqueDefs)
    } else if (isScalarType(mapString)) {
      return {
        kind: "Scalar",
        scalar: mapString as ScalarTypeName,
      }
    } else {
      return parseRef(mapString, uniqueDefs)
    }
    // TODO: is this case necessary?
    // else {
    //   throw new Error(`Unrecognized reference type '${mapString}'`)
    // }
  }

  const openAngleBracketIdx = mapString.indexOf("<");
  const closeAngleBracketIdx = mapString.lastIndexOf(">");

  if (
    closeAngleBracketIdx === -1
  ) {
    throw new Error(`Invalid map value type: ${mapString}`);
  }

  const subtype = mapString.substring(openAngleBracketIdx + 1, closeAngleBracketIdx);

  const firstDelimiter = subtype.indexOf(",");

  const _keyType = subtype.substring(0, firstDelimiter).trim();
  const _valType = subtype.substring(firstDelimiter + 1).trim();

  if (!_keyType || !_valType) {
    throw new Error(`Invalid map value type: ${mapString}`);
  }

  // TODO: Is there a better way to enforce this -> Map key should always be required
  // TODO: Should we throw an error if it's not?
  // const keyRequired = true;
  const keyType = _keyType.endsWith("!") ? _keyType.slice(0, -1) : _keyType;
  const valType = _valType.endsWith("!") ? _valType.slice(0, -1) : _valType;

  if (!isMapKey(keyType)) {
    throw new Error(
      `Found invalid map key type: ${keyType} while parsing ${mapString}`
    );
  }

  return {
    kind: "Map",
    key: {
      kind: "Scalar",
      scalar: keyType as MapKeyTypeName
    },
    value: extractType(valType),
    required: valType.endsWith("!"),
  }

}

const isMap = (typeName: string): boolean => {
  //TODO: would this be the right condition?
  return typeName.startsWith("Map<")
}

const isMapKey = (typeName: string): boolean => {
  return typeName in mapKeyTypeSet;
}

const isArray = (typeName: string): boolean => {
  return typeName.startsWith("[")
}

export const toMapString = (map: MapType): string => {
  const stringifyMapValueType = (anyType: AnyType, required: boolean): string => {
    let result = "";
    switch (anyType.kind) {
      case "Array": result = `[${stringifyMapValueType(anyType.item, anyType.required)}]`
        break;
      case "Ref": result = anyType.ref_name
        break;
      case "Scalar": result = anyType.scalar
        break;
      case "Map": result = toMapString(anyType)
        break;
    }
    return required ? `${result}!` : result;
  }

  return `Map<${map.key.scalar}!, ${stringifyMapValueType(map.value, map.required)}>`
}
