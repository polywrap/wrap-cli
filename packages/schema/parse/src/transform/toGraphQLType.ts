import { TypeInfoTransforms } from ".";
import {
  GenericDefinition,
  AnyDefinition,
  ArrayDefinition,
  MethodDefinition,
  DefinitionKind,
} from "../typeInfo";

function applyRequired(type: string, required: boolean | null): string {
  return `${type}${required ? "!" : ""}`;
}

function anyToGraphQL(any: AnyDefinition): string {
  if (any.object) {
    return toGraphQL(any.object);
  } else if (any.array) {
    return toGraphQL(any.array);
  } else if (any.scalar) {
    return toGraphQL(any.scalar);
  } else if (any.enum) {
    return toGraphQL(any.enum);
  } else {
    throw Error(
      `anyToGraphQL: Any type is invalid.\n${JSON.stringify(any, null, 2)}`
    );
  }
}

function toGraphQL(def: GenericDefinition): string {
  switch (def.kind) {
    case DefinitionKind.Object:
    case DefinitionKind.Enum:
    case DefinitionKind.Scalar:
    case DefinitionKind.ImportedObject:
    case DefinitionKind.ImportedEnum:
      return applyRequired(def.type, def.required);
    case DefinitionKind.Any:
    case DefinitionKind.Property:
      return anyToGraphQL(def as AnyDefinition);
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

      return applyRequired(`[${toGraphQL(array.item)}]`, array.required);
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
    .map((arg) => `${arg.name}: ${toGraphQL(arg)}`)
    .join("\n    ")}
): ${toGraphQL(method.return)}`;
      return result;
    }
    case DefinitionKind.Query:
      return def.type;
    case DefinitionKind.ImportedQuery:
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

export const toGraphQLType: TypeInfoTransforms = {
  enter: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    GenericDefinition: (def: GenericDefinition) => ({
      ...def,
      toGraphQLType: () => toGraphQL(def),
    }),
  },
};
