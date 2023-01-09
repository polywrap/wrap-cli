import { AbiTransforms } from "..";
import { PropertyDef } from "../definitions";
import { toMapString } from "../extract/utils";

export const addAnnotations: AbiTransforms = {
  enter: {
    PropertyDefinition: (def) => {
      const typeInProperty = def.type;
      if (typeInProperty.kind !== "Map") return def;

      return {
        ...def,
        toGraphQLType: (): string =>
          `Map${def.required ? "!" : ""} @annotate(type: "${toMapString(typeInProperty)}")`,
      } as PropertyDef;
    },
  },
};
