import {
  TypeInfoTransforms,
  QueryDefinition,
  ImportedQueryDefinition,
  MethodDefinition
} from "@web3api/schema-parse";

export function queryPointer(): TypeInfoTransforms {
  let queryPointer: QueryDefinition | ImportedQueryDefinition | undefined;

  return {
    enter: {
      QueryDefinition: (def: QueryDefinition) => {
        queryPointer = def;
        return def;
      },
      ImportedQueryDefinition: (def: ImportedQueryDefinition) => {
        queryPointer = def;
        return def;
      },
      MethodDefinition: (def: MethodDefinition) => {
        return {
          ...def,
          query: queryPointer,
        };
      }
    },
  };
}
