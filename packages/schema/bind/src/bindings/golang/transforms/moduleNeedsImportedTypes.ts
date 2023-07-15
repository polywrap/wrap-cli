/* eslint-disable @typescript-eslint/naming-convention */
import {
  ImportedEnumDefinition,
  ImportedEnvDefinition,
  ImportedModuleDefinition,
  ImportedObjectDefinition,
  MethodDefinition,
  ModuleDefinition,
} from "@polywrap/wrap-manifest-types-js";
import { AbiTransforms } from "@polywrap/schema-parse";

interface ModuleNeedsTypesState {
  needsImportedNamespaces: Set<string>;
  importedTypes: Map<string, string>;
}

export function moduleNeedsImportedTypes(): AbiTransforms {
  const state: ModuleNeedsTypesState = {
    importedTypes: new Map(),
    needsImportedNamespaces: new Set(),
  };

  return {
    enter: {
      ImportedEnumDefinition: (def: ImportedEnumDefinition) => {
        state.importedTypes.set(def.type, def.namespace);
        return def;
      },
      ImportedEnvDefinition: (def: ImportedEnvDefinition) => {
        state.importedTypes.set(def.type, def.namespace);
        return def;
      },
      ImportedModuleDefinition: (def: ImportedModuleDefinition) => {
        state.importedTypes.set(def.type, def.namespace);
        return def;
      },
      ImportedObjectDefinition: (def: ImportedObjectDefinition) => {
        state.importedTypes.set(def.type, def.namespace);
        return def;
      },
      MethodDefinition: (def: MethodDefinition) => {
        if (def.arguments && def.arguments.length > 0) {
          for (const arg of def.arguments) {
            const argType = arg.type;
            const importNamespace = state.importedTypes.get(argType);
            if (importNamespace) {
              state.needsImportedNamespaces.add(importNamespace);
            }
          }
        }

        if (def.return) {
          const returnType = def.return.type;
          const importNamespace = state.importedTypes.get(returnType);
          if (importNamespace) {
            state.needsImportedNamespaces.add(importNamespace);
          }
        }
        return def;
      },
    },
    leave: {
      ModuleDefinition: (def: ModuleDefinition) => {
        const needsImportedNamespaces = state.needsImportedNamespaces;
        state.needsImportedNamespaces = new Set();
        state.importedTypes = new Map();
        return {
          ...def,
          needsImportedNamespaces,
        };
      },
    },
  };
}
