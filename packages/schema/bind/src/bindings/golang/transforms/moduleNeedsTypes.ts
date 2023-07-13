import {
  MethodDefinition,
  ModuleDefinition,
} from "@polywrap/wrap-manifest-types-js";
import { AbiTransforms } from "@polywrap/schema-parse";

import { isBaseType, isBuiltInType } from "../types";

interface ModuleNeedsTypesState {
  moduleDefinition?: ModuleDefinition;
  needsTypes?: boolean;
}

export function moduleNeedsTypes(): AbiTransforms {
  const state: ModuleNeedsTypesState = {};

  return {
    enter: {
      ModuleDefinition: (def: ModuleDefinition) => {
        console.log("ENTER", def.type)
        state.moduleDefinition = def;
        state.needsTypes = false;
        return def;
      },
      MethodDefinition: (def: MethodDefinition) => {
        console.log("METHOD", def.name);
        if (def.arguments && def.arguments.length > 0) {
          console.log("NEEDS cause args")
          state.needsTypes = true;
        }

        if (def.return) {
          const returnType = def.return.type;
          if (!isBaseType(returnType) && !isBuiltInType(returnType)) {
            console.log("NEEDS cause ret")
            state.needsTypes = true;
          }
        }
        return def;
      }
    },
    leave: {
      ModuleDefinition: (def: ModuleDefinition) => {
        console.log("LEAVE", def.name)
        const needsTypes = state.needsTypes
        state.moduleDefinition = undefined;
        state.needsTypes = undefined;
        return {
          ...def,
          needsTypes,
        };
      }
    },
  };
}
