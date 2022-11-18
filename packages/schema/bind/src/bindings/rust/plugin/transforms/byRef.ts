import { AbiTransforms } from "@polywrap/schema-parse";
import { AnyDefinition } from "@polywrap/wrap-manifest-types-js";

export function byRef(): AbiTransforms {
  return {
    enter: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      AnyDefinition: (def: AnyDefinition) => {
        const byRefScalars = ["String", "BigInt", "BigNumber", "Map", "Bytes"];

        if (def.scalar) {
          if (byRefScalars.indexOf(def.scalar.type) > -1 || !def.required) {
            return {
              ...def,
              byRef: true,
            };
          }
        }

        return def;
      },
    },
  };
}
