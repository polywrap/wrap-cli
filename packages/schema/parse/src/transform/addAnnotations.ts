import { toGraphQL } from ".";
import { PropertyDefinition, AbiTransforms } from "..";

export const addAnnotations: AbiTransforms = {
  enter: {
    PropertyDefinition: (def: PropertyDefinition): PropertyDefinition => {
      if (def.map) {
        return {
          ...def,
          toGraphQLType: (): string =>
            `Map${def.required ? "!" : ""} @annotate(type: "${toGraphQL(
              def
            )}")`,
        } as PropertyDefinition;
      }

      if (def.fraction) {
        return {
          ...def,
          toGraphQLType: (): string =>
            `Fraction${def.required ? "!" : ""} @annotate(type: "${toGraphQL(
              def
            )}")`,
        } as PropertyDefinition;
      }

      return def;
    },
  },
};
