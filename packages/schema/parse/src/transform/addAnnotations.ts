import { toGraphQL } from ".";
import {
  AnyDefinition,
  DefinitionKind,
  GenericDefinition,
  TypeInfoTransforms,
} from "..";

export const addAnnotations: TypeInfoTransforms = {
  enter: {
    GenericDefinition: (def: GenericDefinition): GenericDefinition => {
      if (def.kind !== DefinitionKind.Property) return def;

      const anyDef = def as AnyDefinition;
      if (!anyDef.map) return def;

      return {
        ...def,
        toGraphQLType: (): string =>
          `Map${def.required ? "!" : ""} @annotate(type: "${toGraphQL(
            anyDef
          )}")`,
      } as GenericDefinition;
    },
  },
};
