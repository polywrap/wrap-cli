import {
  isScalarType,
} from "../..";

import { Reference, SUPPORTED_MAP_KEYS, SUPPORTED_SCALARS } from "../../definitions";


// TODO: Make sure map also works for imported types and modules

export const parseMapReference = (typeName: string, enumDefs: string[]): Reference => {
  if (isArray(typeName)) {
    const closeSquareBracketIdx = typeName.lastIndexOf("]");
    const required = typeName[closeSquareBracketIdx + 1] === "!"
    return {
      kind: "Array",
      required,
      definition: {
        items: parseMapReference(typeName.substring(1, closeSquareBracketIdx), enumDefs),
        kind: "Array",
        name: ""
      }
    };
  } else if (isMap(typeName)) {
    const openAngleBracketIdx = typeName.indexOf("<");
    const closeAngleBracketIdx = typeName.lastIndexOf(">");

    if (
      closeAngleBracketIdx === -1
    ) {
      throw new Error(`Invalid map value type: ${typeName}`);
    }

    const required = typeName.endsWith("!");
    const subtype = typeName.substring(openAngleBracketIdx + 1, closeAngleBracketIdx);

    const firstDelimiter = subtype.indexOf(",");

    const _keyType = subtype.substring(0, firstDelimiter).trim();
    const valType = subtype.substring(firstDelimiter + 1).trim();

    if (!_keyType || !valType) {
      throw new Error(`Invalid map value type: ${typeName}`);
    }

    // TODO: Is there a better way to enforce this -> Map key should always be required
    // TODO: Should we throw an error if it's not?
    const keyRequired = true;
    const keyType = _keyType.endsWith("!") ? _keyType.slice(0, -1) : _keyType;

    if (!isMapKey(keyType)) {
      throw new Error(
        `Found invalid map key type: ${keyType} while parsing ${typeName}`
      );
    }

    return {
      kind: "Map",
      definition: {
        name: "",
        kind: "Map",
        //TODO: validate possible keys
        keys: {
          kind: "Scalar",
          type: keyType as typeof SUPPORTED_SCALARS[number],
          required: keyRequired
        },
        values: parseMapReference(valType, enumDefs)
      },
      required,
    }
  } else if (isScalarType(typeName)) {
    const required = typeName.endsWith("!");
    const subtype = required ? typeName.substring(0, typeName.length - 1) : typeName

    return {
      kind: "Scalar",
      type: subtype as typeof SUPPORTED_SCALARS[number],
      required
    }
  } else if (isEnum(typeName, enumDefs)) {
    const required = typeName.endsWith("!");

    return {
      type: enumDefs.find(e => e === typeName) as string,
      kind: "Enum",
      required
    }
  } else {
    const required = typeName.endsWith("!");

    return {
      type: typeName,
      kind: "Object",
      required
    }
  }
  // TODO: is this case necessary?
  // else {
  //   throw new Error(`Unrecognized reference type '${typeName}'`)
  // }
}

const isMap = (typeName: string): boolean => {
  //TODO: would this be the right condition?
  return typeName.startsWith("Map<")
}

const isEnum = (typeName: string, enumDefs: string[]): boolean => {
  return !!enumDefs.find(o => o === typeName);
}

const isMapKey = (typeName: string): boolean => {
  return SUPPORTED_MAP_KEYS.includes(typeName as typeof SUPPORTED_MAP_KEYS[number]);
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
