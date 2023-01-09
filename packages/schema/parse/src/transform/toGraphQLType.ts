import { ArgumentDef, ArrayType, EnumDef, EnvDef, FunctionDef, MapType, ObjectDef, PropertyDef, RefType, ScalarType } from "../definitions";

function applyRequired(type: string, required: boolean | undefined): string {
  return `${type}${required ? "!" : ""}`;
}

export function toGraphQL(def: ObjectDef | FunctionDef | ArgumentDef | ScalarType | EnvDef | EnumDef | PropertyDef | ArrayType | MapType | RefType, required: boolean): string {
  switch (def.kind) {
    case "Object":
    case "Env":
      return applyRequired(def.name, required);
    case "Scalar":
      return applyRequired(def.scalar, required);
    case "Enum":
      return applyRequired(def.name, required);;
    case "Property":
      return toGraphQL(def.type, def.required);
    case "Array":
      return applyRequired(
        `[${toGraphQL(def.item, def.required)}]`,
        required
      );
    case "Map": {
      return `Map<${def.key}!, ${toGraphQL(def.value, def.required)}>`
    }
    case "Function": {

      const result = `${def.name}(
  ${(def.args || [])
          .map((arg) => `${arg.name}: ${toGraphQL(arg.type, arg.required)}`)
          .join("\n    ")}
): ${toGraphQL(def.result.type, def.result.required)}`;
      return result;
    }
    default:
      throw Error(
        `toGraphQL: Unrecognized Definition or Type.\n${JSON.stringify(
          def,
          null,
          2
        )}`
      );
  }
}

