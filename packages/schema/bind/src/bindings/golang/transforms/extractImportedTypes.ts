/* eslint-disable @typescript-eslint/naming-convention */
import {
  Abi,
  ImportedEnumDefinition,
  ImportedEnvDefinition,
  ImportedModuleDefinition,
  ImportedObjectDefinition,
} from "@polywrap/wrap-manifest-types-js";
import { AbiTransforms } from "@polywrap/schema-parse";

interface State {
  importedTypes: Map<string, string>;
}

export function extractImportedTypes(): AbiTransforms {
  const state: State = {
    importedTypes: new Map(),
  };

  return {
    enter: {
      ImportedEnumDefinition: (def: ImportedEnumDefinition) => {
        state.importedTypes = state.importedTypes.set(def.type, def.namespace);
        return def;
      },
      ImportedEnvDefinition: (def: ImportedEnvDefinition) => {
        state.importedTypes = state.importedTypes.set(def.type, def.namespace);
        return def;
      },
      ImportedModuleDefinition: (def: ImportedModuleDefinition) => {
        state.importedTypes = state.importedTypes.set(def.type, def.namespace);
        return def;
      },
      ImportedObjectDefinition: (def: ImportedObjectDefinition) => {
        state.importedTypes = state.importedTypes.set(def.type, def.namespace);
        return def;
      },
    },
    leave: {
      Abi(abi: Abi) {
        return {
          ...abi,
          importedTypes: state.importedTypes,
        };
      },
    },
  };
}
