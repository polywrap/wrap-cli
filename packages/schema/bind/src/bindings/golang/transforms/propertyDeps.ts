/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-useless-escape */
import { isBaseType, isBuiltInType } from "../types";

import {
  ImportedModuleDefinition,
  ObjectDefinition,
  AnyDefinition,
  ModuleDefinition,
  EnvDefinition,
  Abi,
  ImportedEnvDefinition,
} from "@polywrap/wrap-manifest-types-js";
import { AbiTransforms } from "@polywrap/schema-parse";

interface PropertyDep {
  type: string;
  isEnum: boolean;
}

interface PropertyDepsState {
  abiEnvDefinition?: EnvDefinition;
  envDefinition?: EnvDefinition;
  importedEnvDefinition?: ImportedEnvDefinition;
  objectDefinition?: ObjectDefinition;
  moduleDefinition?: ModuleDefinition;
  importedModuleDefinition?: ImportedModuleDefinition;
  propertyDeps?: PropertyDep[];
}

export function propertyDeps(): AbiTransforms {
  const state: PropertyDepsState = {};

  return {
    enter: {
      Abi: (abi: Abi) => {
        if (abi.envType) {
          state.abiEnvDefinition = abi.envType;
        }
        return abi;
      },
      EnvDefinition: (def: EnvDefinition) => {
        state.envDefinition = def;
        state.propertyDeps = [];
        return def;
      },
      ImportedEnvDefinition: (def: ImportedEnvDefinition) => {
        state.envDefinition = def;
        state.propertyDeps = [];
        return def;
      },
      ObjectDefinition: (def: ObjectDefinition) => {
        state.objectDefinition = def;
        state.propertyDeps = [];
        return def;
      },
      ModuleDefinition: (def: ModuleDefinition) => {
        state.moduleDefinition = def;
        state.propertyDeps = [];
        if (state.abiEnvDefinition) {
          state.propertyDeps.push({
            type: "Env",
            isEnum: false,
          });
        }
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

          const appendUnique = (item: PropertyDep) => {
            if (
              array.findIndex(
                (i) => i.type === item.type
              ) === -1
            ) {
              array.push(item);
            }
          };

          const isKnownType = (name: string) =>
            isBaseType(name) || isBuiltInType(name) || name === rootType;

          // if type is map and the value is custom,
          // we need to add it into property dependency
          if (typeName.startsWith("Map<")) {
            const valueName = def.map?.object?.type ?? def.map?.enum?.type;
            if (valueName && !isKnownType(valueName)) {
              appendUnique({
                type: valueName,
                isEnum: valueName === def.map?.enum?.type,
              });

              return array;
            }

            return array;
          }

          if (isKnownType(typeName)) {
            return array;
          }

          appendUnique({
            type: typeName,
            isEnum: !!def.enum || !!def.array?.enum,
          });

          return array;
        };

        if (state.envDefinition && state.propertyDeps) {
          state.propertyDeps = appendPropertyDep(
            state.envDefinition.type,
            state.propertyDeps
          );
        } else if (state.importedEnvDefinition && state.propertyDeps) {
          state.propertyDeps = appendPropertyDep(
            state.importedEnvDefinition.type,
            state.propertyDeps
          );
        } else if (state.objectDefinition && state.propertyDeps) {
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
      EnvDefinition: (def: EnvDefinition) => {
        const propertyDeps = state.propertyDeps;
        state.propertyDeps = undefined;
        state.envDefinition = undefined;
        return {
          ...def,
          propertyDeps,
        };
      },
      ImportedEnvDefinition: (def: ImportedEnvDefinition) => {
        const propertyDeps = state.propertyDeps;
        state.propertyDeps = undefined;
        state.importedEnvDefinition = undefined;
        return {
          ...def,
          propertyDeps,
        };
      },
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
