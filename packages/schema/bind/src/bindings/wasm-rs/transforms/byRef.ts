import { TypeInfoTransforms, AnyDefinition } from "@web3api/schema-parse";

export function byRef(): TypeInfoTransforms {
  return {
    enter: {
      AnyDefinition: (def: AnyDefinition) => {
        const byRefScalars = [
          "String",
          "BigInt",
          "Bytes"
        ];

        if (def.scalar) {
          if (byRefScalars.indexOf(def.scalar.type) > -1 || !def.required) {
            return {
              ...def,
              byRef: true,
            };
          }
        }

        return def;
      }
    }
  }
};
