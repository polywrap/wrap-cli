import {
  createArrayDefinition,
  createMapDefinition,
  createMapKeyDefinition,
  createScalarDefinition,
  createUnresolvedObjectOrEnumRef,
} from "../..";
import { isMapKeyType, isScalarType } from "../../abi/utils";

import { GenericDefinition } from "@polywrap/wrap-manifest-types-js";

type CurrentAbi = {
  currentType: string;
  subType: string | undefined;
  required: boolean | undefined;
};

// TODO: Make sure map also works for imported types and modules

const _parseCurrentType = (rootType: string, type: string): CurrentAbi => {
  let required = undefined;
  if (type.startsWith("[")) {
    const closeSquareBracketIdx = type.lastIndexOf("]");
    if (type[closeSquareBracketIdx + 1] === "!") {
      required = true;
    }
    return {
      currentType: "Array",
      subType: type.substring(1, closeSquareBracketIdx),
      required: required,
    };
  }

  let hasSubType = true;
  const openAngleBracketIdx = type.indexOf("<");
  const closeAngleBracketIdx = type.lastIndexOf(">");

  if (
    (openAngleBracketIdx === -1 && closeAngleBracketIdx !== -1) ||
    (openAngleBracketIdx !== -1 && closeAngleBracketIdx === -1)
  ) {
    throw new Error(`Invalid map value type: ${rootType}`);
  }

  if (openAngleBracketIdx === -1 && closeAngleBracketIdx === -1) {
    if (type === "Array" || type === "Map") {
      throw new Error(`Invalid map value type: ${rootType}`);
    }
    if (type.endsWith("!")) {
      required = true;
    }
    hasSubType = false;
  }

  if (type[closeAngleBracketIdx + 1] === "!") {
    required = true;
  }

  return {
    currentType: hasSubType
      ? type.substring(0, openAngleBracketIdx)
      : required
      ? type.substring(0, type.length - 1)
      : type,
    subType: hasSubType
      ? type.substring(openAngleBracketIdx + 1, closeAngleBracketIdx)
      : undefined,
    required: required,
  };
};

const _toGraphQLType = (rootType: string, type: string): string => {
  const parsedCurrentType = _parseCurrentType(rootType, type);
  let { subType } = parsedCurrentType;
  const { currentType } = parsedCurrentType;

  if (!subType) {
    return currentType;
  }

  switch (currentType) {
    case "Array": {
      if (subType.endsWith("!")) {
        subType = subType.slice(0, -1);
      }
      return `[${_toGraphQLType(rootType, subType)}]`;
    }
    case "Map": {
      const firstDelimiter = subType.indexOf(",");

      const keyType = subType.substring(0, firstDelimiter).trim();
      const valType = subType.substring(firstDelimiter + 1).trim();

      return `Map<${_toGraphQLType(rootType, keyType)}, ${_toGraphQLType(
        rootType,
        valType
      )}>`;
    }
    default:
      throw new Error(
        `Found unknown type ${currentType} while parsing ${rootType}`
      );
  }
};

const _parseMapType = (
  rootType: string,
  type: string,
  name?: string
): GenericDefinition => {
  const { currentType, subType, required } = _parseCurrentType(rootType, type);

  if (!subType) {
    if (isScalarType(currentType)) {
      return createScalarDefinition({
        name: name,
        type: currentType,
        required: required,
      });
    }

    return createUnresolvedObjectOrEnumRef({
      name: name,
      type: currentType,
      required: required,
    });
  }

  switch (currentType) {
    case "Array": {
      return createArrayDefinition({
        name: name,
        type: _toGraphQLType(rootType, type),
        item: _parseMapType(rootType, subType, name),
        required: required,
      });
    }
    case "Map": {
      const firstDelimiter = subType.indexOf(",");

      const _keyType = subType.substring(0, firstDelimiter).trim();
      const valType = subType.substring(firstDelimiter + 1).trim();

      if (!_keyType || !valType) {
        throw new Error(`Invalid map value type: ${rootType}`);
      }

      // TODO: Is there a better way to enforce this -> Map key should always be required
      // TODO: Should we throw an error if it's not?
      const keyRequired = true;
      const keyType = _keyType.endsWith("!") ? _keyType.slice(0, -1) : _keyType;

      if (!isMapKeyType(keyType)) {
        throw new Error(
          `Found invalid map key type: ${keyType} while parsing ${rootType}`
        );
      }

      return createMapDefinition({
        type: _toGraphQLType(rootType, type),
        name: name,
        key: createMapKeyDefinition({
          name: name,
          type: keyType,
          required: keyRequired,
        }),
        value: _parseMapType(rootType, valType, name),
        required: required,
      });
    }
    default:
      throw new Error(`Invalid map value type: ${type}`);
  }
};

export function parseCurrentType(type: string): CurrentAbi {
  return _parseCurrentType(type, type);
}

export function parseMapType(type: string, name?: string): GenericDefinition {
  return _parseMapType(type, type, name);
}

export function toGraphQLType(type: string): string {
  return _toGraphQLType(type, type);
}
