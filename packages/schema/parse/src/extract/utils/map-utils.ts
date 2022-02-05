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

export function findFirstOpenBracket(type: string): number {
  let openSquareBracket = -1;
  for (let i = 0; i < type.length; i++) {
    if (type[i] === "<") {
      openSquareBracket = i;
      break;
    }
  }
  return openSquareBracket;
}

export function findLastCloseBracket(type: string): number {
  let closeSquareBracket = -1;
  for (let i = type.length - 1; i >= 0; i--) {
    if (type[i] === ">") {
      closeSquareBracket = i;
      break;
    }
  }
  return closeSquareBracket;
}

export function toGraphQLType(type: string): string {
  const firstOpenBracketIdx = findFirstOpenBracket(type);
  const lastCloseBracketIdx = findLastCloseBracket(type);

  if (firstOpenBracketIdx === -1 && lastCloseBracketIdx === -1)  {
    return type.endsWith("!") ? type.slice(0, -1) : type;
  }

  const currentType = type.substring(0, firstOpenBracketIdx);

  switch (currentType) {
    case "Array": {
      let subType = type.substring(
        firstOpenBracketIdx + 1,
        lastCloseBracketIdx
      );
      if (subType.endsWith("!")) {
        subType = subType.slice(0, -1);
      }
      return `[${toGraphQLType(subType)}]`;
    }
    case "Map": {
      const [keyType, valueType] = type
        .substring(firstOpenBracketIdx + 1, lastCloseBracketIdx)
        .split(",")
        .map((x) => x.trim());
      return `Map<${toGraphQLType(keyType)}, ${toGraphQLType(valueType)}>`;
    }
    default:
      throw new Error(`Unknown type ${currentType}`);
  }
}

export function parseMapType(type: string): GenericDefinition {
  const firstOpenBracketIdx = findFirstOpenBracket(type);
  const lastCloseBracketIdx = findLastCloseBracket(type);

  if (
    (firstOpenBracketIdx === -1 && lastCloseBracketIdx !== -1) ||
    (firstOpenBracketIdx !== -1 && lastCloseBracketIdx === -1)
  ) {
    throw new Error(`Invalid map value type: ${type}`);
  }

  if (firstOpenBracketIdx === -1 && lastCloseBracketIdx === -1) {
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

  const currentType = type.substring(0, firstOpenBracketIdx);

  switch (currentType) {
    case "Array": {
      const subType = type.substring(
        firstOpenBracketIdx + 1,
        lastCloseBracketIdx
      );
      const required = type[lastCloseBracketIdx + 1] === "!";
      return createArrayDefinition({
        type: toGraphQLType(type),
        item: parseMapType(subType),
        required: required,
      });
    }
    case "Map": {
      const keyValTypes = type
        .substring(firstOpenBracketIdx + 1, lastCloseBracketIdx)
        .split(",")
        .map((x) => x.trim());

      const required = type[lastCloseBracketIdx + 1] === "!";

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
        type: toGraphQLType(type),
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
