/* eslint-disable @typescript-eslint/naming-convention */
import { isBaseType, isBuiltInType } from "../types";

import {
  MethodDefinition,
  ModuleDefinition,
} from "@polywrap/wrap-manifest-types-js";
import { AbiTransforms } from "@polywrap/schema-parse";

interface ModuleNeedsTypesState {
  moduleDefinition?: ModuleDefinition;
  needsTypes?: boolean;
  importedTypes?: Map<string, string>;
}

export function moduleNeedsTypes(): AbiTransforms {
  const state: ModuleNeedsTypesState = {};

  return {
    enter: {
      Abi: (abi) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        state.importedTypes = abi._importedTypes;
        return abi;
      },
      ModuleDefinition: (def: ModuleDefinition) => {
        state.moduleDefinition = def;
        state.needsTypes = false;
        return def;
      },
      MethodDefinition: (def: MethodDefinition) => {
        if (def.arguments && def.arguments.length > 0) {
          state.needsTypes = true;
        }

        if (def.return) {
          const returnType = def.return.type;
          if (
            !isBaseType(returnType) &&
            !isBuiltInType(returnType) &&
            !state.importedTypes?.has(returnType)
          ) {
            state.needsTypes = true;
          }
        }
        return def;
      },
    },
    leave: {
      ModuleDefinition: (def: ModuleDefinition) => {
        const needsTypes = state.needsTypes;
        state.moduleDefinition = undefined;
        state.needsTypes = undefined;
        return {
          ...def,
          needsTypes,
        };
      },
    },
  };
}
