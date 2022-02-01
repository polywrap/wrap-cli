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

export function findFirstOpenSquareBracket(type: string): number {
  let openSquareBracket = -1;
  for (let i = 0; i < type.length; i++) {
    if (type[i] === "[") {
      openSquareBracket = i;
      break;
    }
  }
  return openSquareBracket;
}

export function findLastCloseSquareBracket(type: string): number {
  let closeSquareBracket = -1;
  for (let i = type.length - 1; i >= 0; i--) {
    if (type[i] === "]") {
      closeSquareBracket = i;
      break;
    }
  }
  return closeSquareBracket;
}

export function parseMapType(type: string): GenericDefinition {
  const firstOpenSquareBracketIdx = findFirstOpenSquareBracket(type);
  const lastCloseSquareBracketIdx = findLastCloseSquareBracket(type);

  if (
    (firstOpenSquareBracketIdx === -1 && lastCloseSquareBracketIdx !== -1) ||
    (firstOpenSquareBracketIdx !== -1 && lastCloseSquareBracketIdx === -1)
  ) {
    throw new Error(`Invalid map value type: ${type}`);
  }

  if (firstOpenSquareBracketIdx === -1 && lastCloseSquareBracketIdx === -1) {
    if (type === "Array" || type === "Map") {
      throw new Error(`Invalid map value type: ${type}`);
    }

    let required = false;
    if (type.endsWith("!")) {
      type = type.slice(0, -1);
      required = true;
    }

    if (isScalarType(type)) {
      return createScalarDefinition({
        type: type,
        required: required,
      });
    }

    return createUnresolvedObjectOrEnumRef({
      type: type,
      required: required,
    });
  }

  const currentType = type.substring(0, firstOpenSquareBracketIdx);

  switch (currentType) {
    case "Array": {
      const subType = type.substring(
        firstOpenSquareBracketIdx + 1,
        lastCloseSquareBracketIdx
      );
      const required = type[lastCloseSquareBracketIdx + 1] === "!";
      return createArrayDefinition({
        type: "N/A",
        item: parseMapType(subType),
        required: required,
      });
    }
    case "Map": {
      const keyValTypes = type
        .substring(firstOpenSquareBracketIdx + 1, lastCloseSquareBracketIdx)
        .split(",")
        .map((x) => x.trim());

      const required = type[lastCloseSquareBracketIdx + 1] === "!";

      if (
        keyValTypes.length !== 2 ||
        keyValTypes[0] === "" ||
        keyValTypes[1] === ""
      ) {
        throw new Error(`Invalid map value type: ${type}`);
      }

      let [keyType, valueType] = keyValTypes;
      let keyRequired = false;

      if (keyType.endsWith("!")) {
        keyType = keyType.slice(0, -1);
        keyRequired = true;
      }

      if (!isMapKeyType(keyType)) {
        throw new Error(`Invalid map key type: ${keyType}`);
      }

      return createMapDefinition({
        type: "Map",
        key: createMapKeyDefinition({
          type: keyType,
          required: keyRequired,
        }),
        value: parseMapType(valueType),
        required: required,
      });
    }
    default:
      throw new Error(`Invalid map value type: ${type}`);
  }
}
