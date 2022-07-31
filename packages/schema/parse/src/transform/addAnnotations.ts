import { toGraphQL } from ".";
import { PropertyDefinition, AbiTransforms } from "..";

export const addAnnotations: AbiTransforms = {
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
