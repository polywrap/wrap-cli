/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Abi,
  EnumRef,
  ObjectRef,
  ModuleDefinition,
  ObjectDefinition,
} from "@polywrap/wrap-manifest-types-js";
import { AbiTransforms } from "@polywrap/schema-parse";

interface State {
  importedTypes: Map<string, string>;
  moduleDef?: ModuleDefinition;
  objectDef?: ObjectDefinition;
}

export function appendImportedTypes(): AbiTransforms {
  const state: State = {
    importedTypes: new Map(),
  };

  const addImportedTypeRef = (def: EnumRef | ObjectRef) => {
    const importType = state.importedTypes.get(def.type);

    if (importType) {
      if (state.moduleDef) {
        const importedTypes: string[] =
          (state.moduleDef as any).importedTypes || [];
        if (importedTypes.indexOf(importType) === -1) {
          importedTypes.push(importType);
        }
        state.moduleDef = {
          ...state.moduleDef,
          importedTypes,
        } as ModuleDefinition;
      }

      if (state.objectDef) {
        const importedTypes: string[] =
          (state.objectDef as any).importedTypes || [];
        if (importedTypes.indexOf(importType) === -1) {
          importedTypes.push(importType);
        }
        state.objectDef = {
          ...state.objectDef,
          importedTypes,
        } as ObjectDefinition;
      }
    }

    return def;
  };

  return {
    enter: {
      Abi: (abi: Abi) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        state.importedTypes = abi.importedTypes;
        return abi;
      },
      ModuleDefinition: (def: ModuleDefinition) => {
        state.moduleDef = def;
        return def;
      },
      ObjectDefinition: (def: ObjectDefinition) => {
        if (!state.moduleDef) {
          state.objectDef = def;
        }

        return def;
      },
      EnumRef: (def: EnumRef) => {
        return addImportedTypeRef(def);
      },
      ObjectRef: (def: ObjectRef) => {
        return addImportedTypeRef(def);
      },
    },
    leave: {
      ModuleDefinition: (def: ModuleDefinition) => {
        const newDef = state.moduleDef || def;
        state.moduleDef = undefined;
        return newDef;
      },
      ObjectDefinition: (def: ObjectDefinition) => {
        const newDef = state.objectDef || def;
        state.objectDef = undefined;
        return newDef;
      },
    },
  };
}
