/* eslint-disable @typescript-eslint/naming-convention */
import {
  TypeInfoTransforms,
  ModuleDefinition,
  ImportedModuleDefinition,
  MethodDefinition,
} from "@web3api/schema-parse";

export function queryPointer(): TypeInfoTransforms {
  let queryPointer: ModuleDefinition | ImportedModuleDefinition | undefined;

  return {
    enter: {
      ModuleDefinition: (def: ModuleDefinition) => {
        queryPointer = def;
        return def;
      },
      ImportedModuleDefinition: (def: ImportedModuleDefinition) => {
        queryPointer = def;
        return def;
      },
      MethodDefinition: (def: MethodDefinition) => {
        return {
          ...def,
          query: queryPointer,
        };
      },
    },
  };
}
