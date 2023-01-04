import {
  isScalarType,
} from "../..";
import { AnyType, MapKeyTypeName, mapKeyTypeSet, MapType, ScalarTypeName } from "../../definitions";


// TODO: Make sure map also works for imported types and modules

export const parseMapReference = (typeName: string, enumDefs: string[]): MapType => {
  const extractType = (typeName: string): AnyType => {
    if (isArray(typeName)) {
      const closeSquareBracketIdx = typeName.lastIndexOf("]");
      const required = typeName[closeSquareBracketIdx + 1] === "!"
      return {
        kind: "Array",
        required,
        item: extractType(typeName.substring(1, closeSquareBracketIdx))
      };
    } else if (isMap(typeName)) {
      return parseMapReference(typeName, enumDefs)
    } else if (isScalarType(typeName)) {
      return {
        kind: "Scalar",
        scalar: typeName as ScalarTypeName,
      }
    } else {
      return {
        kind: "Ref",
        ref_kind: isEnum(typeName, enumDefs) ? "Enum" : "Object",
        ref_name: typeName,
      }
    }
    // TODO: is this case necessary?
    // else {
    //   throw new Error(`Unrecognized reference type '${typeName}'`)
    // }
  }

  const openAngleBracketIdx = typeName.indexOf("<");
  const closeAngleBracketIdx = typeName.lastIndexOf(">");

  if (
    closeAngleBracketIdx === -1
  ) {
    throw new Error(`Invalid map value type: ${typeName}`);
  }

  const subtype = typeName.substring(openAngleBracketIdx + 1, closeAngleBracketIdx);

  const firstDelimiter = subtype.indexOf(",");

  const _keyType = subtype.substring(0, firstDelimiter).trim();
  const _valType = subtype.substring(firstDelimiter + 1).trim();

  if (!_keyType || !_valType) {
    throw new Error(`Invalid map value type: ${typeName}`);
  }

  // TODO: Is there a better way to enforce this -> Map key should always be required
  // TODO: Should we throw an error if it's not?
  // const keyRequired = true;
  const keyType = _keyType.endsWith("!") ? _keyType.slice(0, -1) : _keyType;
  const valType = _valType.endsWith("!") ? _valType.slice(0, -1) : _valType;

  if (!isMapKey(keyType)) {
    throw new Error(
      `Found invalid map key type: ${keyType} while parsing ${typeName}`
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

const isEnum = (typeName: string, enumDefs: string[]): boolean => {
  return !!enumDefs.find(o => o === typeName);
}

const isMapKey = (typeName: string): boolean => {
  return typeName in mapKeyTypeSet;
}

const isArray = (typeName: string): boolean => {
  return typeName.startsWith("[")
}

// const _toGraphQLType = (rootType: string, type: string): string => {
//   const parsedCurrentType = _parseCurrentType(rootType, type);
//   let { subType } = parsedCurrentType;
//   const { currentType } = parsedCurrentType;

//   if (!subType) {
//     return currentType;
//   }

//   switch (currentType) {
//     case "Array": {
//       if (subType.endsWith("!")) {
//         subType = subType.slice(0, -1);
//       }
//       return `[${_toGraphQLType(rootType, subType)}]`;
//     }
//     case "Map": {
//       const firstDelimiter = subType.indexOf(",");

//       const keyType = subType.substring(0, firstDelimiter).trim();
//       const valType = subType.substring(firstDelimiter + 1).trim();

//       return `Map<${_toGraphQLType(rootType, keyType)}, ${_toGraphQLType(
//         rootType,
//         valType
//       )}>`;
//     }
//     default:
//       throw new Error(
//         `Found unknown type ${currentType} while parsing ${rootType}`
//       );
//   }
// };

// export function toGraphQLType(type: string): string {
//   return _toGraphQLType(type, type);
// }
