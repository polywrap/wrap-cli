/* eslint-disable @typescript-eslint/naming-convention */
import {
  Abi,
  ImportedEnumDefinition,
  ImportedEnvDefinition,
  ImportedModuleDefinition,
  ImportedObjectDefinition,
  MethodDefinition,
  ModuleDefinition,
} from "@polywrap/wrap-manifest-types-js";
import { AbiTransforms } from "@polywrap/schema-parse";

interface ImportedTypesState {
  importedTypes: Map<string, string>;
}

interface ModuleNeedsImportedTypesState extends ImportedTypesState {
  needsImportedNamespaces: Set<string>;
}

export function extractImportedTypes(): AbiTransforms {
  const state: ImportedTypesState = {
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
          _importedTypes: state.importedTypes,
        };
      },
    },
  };
}

export function extractNeededImportedNamespaces(): AbiTransforms {
  const state: ModuleNeedsImportedTypesState = {
    importedTypes: new Map(),
    needsImportedNamespaces: new Set(),
  };

  return {
    enter: {
      Abi: (abi: Abi) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        state.importedTypes = abi._importedTypes;
        return abi;
      },
      MethodDefinition: (def: MethodDefinition) => {
        if (def.arguments && def.arguments.length > 0) {
          for (const arg of def.arguments) {
            const argType = arg.type;
            const importNamespace = state.importedTypes?.get(argType);
            if (importNamespace) {
              state.needsImportedNamespaces?.add(importNamespace);
            }
          }
        }

        if (def.return) {
          const returnType = def.return.type;
          const importNamespace = state.importedTypes?.get(returnType);
          if (importNamespace) {
            state.needsImportedNamespaces?.add(importNamespace);
          }
        }
        return def;
      },
    },
    leave: {
      Abi: (abi: Abi) => {
        return {
          ...abi,
          _needsImportedNamespaces: state.needsImportedNamespaces,
        };
      },
    },
  };
}

export function needsImportedNamespaces(): AbiTransforms {
  const state: ModuleNeedsImportedTypesState = {
    importedTypes: new Map(),
    needsImportedNamespaces: new Set(),
  };

  return {
    enter: {
      Abi: (abi: Abi) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        state.needsImportedNamespaces = abi._needsImportedNamespaces;
        return abi;
      },
    },
    leave: {
      ModuleDefinition: (def: ModuleDefinition) => {
        const needsImportedNamespaces = Array.from(
          state.needsImportedNamespaces
        );
        return {
          ...def,
          needsImportedNamespaces,
        };
      },
    },
  };
}
