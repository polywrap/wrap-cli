import { TypeInfoTransforms, AnyDefinition } from "@web3api/schema-parse";

export function byRef(): TypeInfoTransforms {
  return {
    enter: {
      AnyDefinition: (def: AnyDefinition) => {
        if (def.scalar && def.scalar.type === "String") {
          return {
            ...def,
            byRef: true,
          };
        } else {
          return def;
        }
      }
    }
  }
};
