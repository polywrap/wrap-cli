import { toGraphQL } from ".";
import { AbiTransforms } from "..";

import { PropertyDefinition } from "@polywrap/wrap-manifest-types-js";

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
