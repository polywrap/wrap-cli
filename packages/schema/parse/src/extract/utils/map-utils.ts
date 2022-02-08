import {
  createArrayDefinition,
  createMapDefinition,
  createMapKeyDefinition,
  createScalarDefinition,
  createUnresolvedObjectOrEnumRef,
  GenericDefinition,
  isScalarType,
  isMapKeyType,
} from "../..";

type CurrentTypeInfo = {
  currentType: string;
  subType: string | null;
  required: boolean;
};

function _parseCurrentType(rootType: string, type: string): CurrentTypeInfo {
  let required = false;
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

  let hasSubType: boolean = true;
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
      : null,
    required: required,
  };
}

function _toGraphQLType(rootType: string, type: string): string {
  let { currentType, subType } = _parseCurrentType(rootType, type);

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
      const [keyType, valueType] = subType.split(",").map((x) => x.trim());
      return `Map<${_toGraphQLType(rootType, keyType)}, ${_toGraphQLType(
        rootType,
        valueType
      )}>`;
    }
    default:
      throw new Error(
        `Found unknown type ${currentType} while parsing ${rootType}`
      );
  }
}

function _parseMapType(rootType: string, type: string): GenericDefinition {
  let { currentType, subType, required } = _parseCurrentType(rootType, type);

  if (!subType) {
    if (isScalarType(currentType)) {
      return createScalarDefinition({
        type: currentType,
        required: required,
      });
    }

    return createUnresolvedObjectOrEnumRef({
      type: currentType,
      required: required,
    });
  }

  switch (currentType) {
    case "Array": {
      return createArrayDefinition({
        type: _toGraphQLType(rootType, type),
        item: _parseMapType(rootType, subType),
        required: required,
      });
    }
    case "Map": {
      const keyValTypes = subType.split(",").map((x) => x.trim());

      if (
        keyValTypes.length !== 2 ||
        keyValTypes[0] === "" ||
        keyValTypes[1] === ""
      ) {
        throw new Error(`Invalid map value type: ${rootType}`);
      }

      let [keyType, valueType] = keyValTypes;
      // TODO: Is there a better way to enforce this -> Map key should always be required
      // TODO: Should we throw an error if it's not?
      let keyRequired = true;

      if (keyType.endsWith("!")) {
        keyType = keyType.slice(0, -1);
      }

      if (!isMapKeyType(keyType)) {
        throw new Error(
          `Found invalid map key type: ${keyType} while parsing ${rootType}`
        );
      }

      return createMapDefinition({
        type: _toGraphQLType(rootType, type),
        key: createMapKeyDefinition({
          type: keyType,
          required: keyRequired,
        }),
        value: _parseMapType(rootType, valueType),
        required: required,
      });
    }
    default:
      throw new Error(`Invalid map value type: ${type}`);
  }
}

export function parseCurrentType(type: string): CurrentTypeInfo {
  return _parseCurrentType(type, type);
}

export function parseMapType(type: string): GenericDefinition {
  return _parseMapType(type, type);
}

export function toGraphQLType(type: string): string {
  return _toGraphQLType(type, type);
}
