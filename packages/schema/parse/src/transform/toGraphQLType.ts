import { AbiTransforms } from ".";
import {
  GenericDefinition,
  AnyDefinition,
  ArrayDefinition,
  MethodDefinition,
  DefinitionKind,
  MapDefinition,
} from "../abi";

function applyRequired(type: string, required: boolean | null): string {
  return `${type}${required ? "!" : ""}`;
}

function anyToGraphQL(any: AnyDefinition, prefixed: boolean): string {
  if (any.object) {
    return toGraphQL(any.object, prefixed);
  } else if (any.array) {
    return toGraphQL(any.array, prefixed);
  } else if (any.scalar) {
    return toGraphQL(any.scalar, prefixed);
  } else if (any.enum) {
    return toGraphQL(any.enum, prefixed);
  } else if (any.map) {
    return toGraphQL(any.map, prefixed);
  } else {
    throw Error(
      `anyToGraphQL: Any type is invalid.\n${JSON.stringify(any, null, 2)}`
    );
  }
}

export function toGraphQL(def: GenericDefinition, prefixed = false): string {
  switch (def.kind) {
    case DefinitionKind.Object:
    case DefinitionKind.ObjectRef:
    case DefinitionKind.Scalar:
    case DefinitionKind.ImportedObject:
      return applyRequired(def.type, def.required);
    case DefinitionKind.Enum:
    case DefinitionKind.EnumRef:
    case DefinitionKind.ImportedEnum:
      if (prefixed) {
        return applyRequired(`Enum_${def.type}`, def.required);
      }

      return applyRequired(def.type, def.required);
    case DefinitionKind.Any:
    case DefinitionKind.Property:
      return anyToGraphQL(def as AnyDefinition, prefixed);
    case DefinitionKind.Array: {
      const array = def as ArrayDefinition;

      if (!array.item) {
        throw Error(
          `toGraphQL: ArrayDefinition's item type is undefined.\n${JSON.stringify(
            array,
            null,
            2
          )}`
        );
      }

      return applyRequired(
        `[${toGraphQL(array.item, prefixed)}]`,
        array.required
      );
    }
    case DefinitionKind.Map: {
      const map = def as MapDefinition;
      if (!map.key) {
        throw Error(
          `toGraphQL: MapDefinition's key type is undefined.\n${JSON.stringify(
            map,
            null,
            2
          )}`
        );
      }
      if (!map.value) {
        throw Error(
          `toGraphQL: MapDefinition's value type is undefined.\n${JSON.stringify(
            map,
            null,
            2
          )}`
        );
      }
      return applyRequired(
        `Map<${toGraphQL(map.key, prefixed)}, ${anyToGraphQL(map, prefixed)}>`,
        map.required
      );
    }
    case DefinitionKind.Method: {
      const method = def as MethodDefinition;

      if (!method.return) {
        throw Error(
          `toGraphQL: MethodDefinition's return type is undefined.\n${JSON.stringify(
            method,
            null,
            2
          )}`
        );
      }

      const result = `${method.name}(
  ${method.arguments
    .map((arg) => `${arg.name}: ${toGraphQL(arg, prefixed)}`)
    .join("\n    ")}
): ${toGraphQL(method.return, prefixed)}`;
      return result;
    }
    case DefinitionKind.Module:
      return def.type;
    case DefinitionKind.ImportedModule:
      return def.type;
    default:
      throw Error(
        `toGraphQL: Unrecognized DefinitionKind.\n${JSON.stringify(
          def,
          null,
          2
        )}`
      );
  }
}

export function toPrefixedGraphQL(def: GenericDefinition): string {
  return toGraphQL(def, true);
}

export const toPrefixedGraphQLType: AbiTransforms = {
  enter: {
    GenericDefinition: (def: GenericDefinition) => ({
      ...def,
      toGraphQLType: () => toPrefixedGraphQL(def),
    }),
  },
};

export const toGraphQLType: AbiTransforms = {
  enter: {
    GenericDefinition: (def: GenericDefinition) => ({
      ...def,
      toGraphQLType: () => toGraphQL(def),
    }),
  },
};
