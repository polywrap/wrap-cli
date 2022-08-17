import { AbiTransforms } from ".";

import {
  ImportedModuleDefinition,
  MethodDefinition,
  ModuleDefinition,
} from "@polywrap/wrap-manifest-types-js";

export function methodParentPointers(): AbiTransforms {
  const visitorStack: (ModuleDefinition | ImportedModuleDefinition)[] = [];

  return {
    enter: {
      ModuleDefinition: (def: ModuleDefinition) => {
        visitorStack.push(def);
        return def;
      },
      ImportedModuleDefinition: (def: ImportedModuleDefinition) => {
        visitorStack.push(def);
        return def;
      },
      MethodDefinition: (def: MethodDefinition) => {
        const parent =
          visitorStack.length > 0
            ? visitorStack[visitorStack.length - 1]
            : undefined;

        return {
          ...def,
          parent,
        };
      },
    },
    leave: {
      ModuleDefinition: (def: ModuleDefinition) => {
        visitorStack.pop();
        return def;
      },
      ImportedModuleDefinition: (def: ImportedModuleDefinition) => {
        visitorStack.pop();
        return def;
      },
    },
  };
}
