/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-useless-escape */
import { isBaseType, isBuiltInType } from "../types";

import {
  ImportedModuleDefinition,
  ObjectDefinition,
  AnyDefinition,
  ModuleDefinition,
  AbiTransforms,
} from "@polywrap/schema-parse";

interface PropertyDep {
  crate: string;
  type: string;
  isEnum: boolean;
}

interface PropertyDepsState {
  objectDefinition?: ObjectDefinition;
  moduleDefinition?: ModuleDefinition;
  importedModuleDefinition?: ImportedModuleDefinition;
  propertyDeps?: PropertyDep[];
}

export function propertyDeps(): AbiTransforms {
  const state: PropertyDepsState = {};

  return {
    enter: {
      ObjectDefinition: (def: ObjectDefinition) => {
        state.objectDefinition = def;
        state.propertyDeps = [];
        return def;
      },
      ModuleDefinition: (def: ModuleDefinition) => {
        state.moduleDefinition = def;
        state.propertyDeps = [];
        return def;
      },
      ImportedModuleDefinition: (def: ImportedModuleDefinition) => {
        state.importedModuleDefinition = def;
        state.propertyDeps = [];
        return def;
      },
      AnyDefinition: (def: AnyDefinition) => {
        const appendPropertyDep = (
          rootType: string,
          array: PropertyDep[]
        ): PropertyDep[] => {
          let typeName = def.type;

          if (typeName.indexOf("[") === 0) {
            typeName = typeName.replace(/\[|\]|\!|\?/g, "");
          }

          if (
            isBaseType(typeName) ||
            isBuiltInType(typeName) ||
            typeName === rootType
          ) {
            return array;
          }

          const appendUnique = (item: PropertyDep) => {
            if (
              array.findIndex(
                (i) => i.crate === item.crate && i.type === item.type
              ) === -1
            ) {
              array.push(item);
            }
          };

          appendUnique({
            crate: "crate",
            type: typeName,
            isEnum: !!def.enum,
          });

          return array;
        };

        if (state.objectDefinition && state.propertyDeps) {
          state.propertyDeps = appendPropertyDep(
            state.objectDefinition.type,
            state.propertyDeps
          );
        } else if (state.moduleDefinition && state.propertyDeps) {
          state.propertyDeps = appendPropertyDep(
            state.moduleDefinition.type,
            state.propertyDeps
          );
        } else if (state.importedModuleDefinition && state.propertyDeps) {
          state.propertyDeps = appendPropertyDep(
            state.importedModuleDefinition.type,
            state.propertyDeps
          );
        }

        return def;
      },
    },
    leave: {
      ObjectDefinition: (def: ObjectDefinition) => {
        const propertyDeps = state.propertyDeps;
        state.propertyDeps = undefined;
        state.objectDefinition = undefined;
        return {
          ...def,
          propertyDeps,
        };
      },
      ModuleDefinition: (def: ModuleDefinition) => {
        const propertyDeps = state.propertyDeps;
        state.propertyDeps = undefined;
        state.moduleDefinition = undefined;
        return {
          ...def,
          propertyDeps,
        };
      },
      ImportedModuleDefinition: (def: ImportedModuleDefinition) => {
        const propertyDeps = state.propertyDeps;
        state.propertyDeps = undefined;
        state.importedModuleDefinition = undefined;
        return {
          ...def,
          propertyDeps,
        };
      },
    },
  };
}
