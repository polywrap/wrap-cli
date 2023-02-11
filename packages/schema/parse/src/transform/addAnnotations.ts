import { AbiTransforms } from "..";
import { PropertyDef } from "../definitions";
import { toGraphQL } from "./toGraphQLType";

export const addAnnotations: AbiTransforms = {
  enter: {
    PropertyDefinition: (def) => {
      const typeInProperty = def.type;
      if (typeInProperty.kind !== "Map") return def;

      return {
        ...def,
        toGraphQLType: (): string =>
          `Map${def.required ? "!" : ""} @annotate(type: "${toGraphQL(typeInProperty, def.required)}")`,
      } as PropertyDef;
    },
  },
};
