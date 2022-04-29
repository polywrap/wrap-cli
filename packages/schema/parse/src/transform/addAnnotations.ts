import { toGraphQL } from ".";
import { PropertyDefinition, TypeInfoTransforms } from "..";

export const addAnnotations: TypeInfoTransforms = {
  enter: {
    PropertyDefinition: (def: PropertyDefinition): PropertyDefinition => {
      if (!def.map) return def;

      return {
        ...def,
        toGraphQLType: (): string =>
          `Map${def.required ? "!" : ""} @annotate(type: "${toGraphQL(def)}")`,
      } as PropertyDefinition;
    },
  },
};
