/* eslint-disable @typescript-eslint/naming-convention */
import { isBaseType } from "../types";

import {
  ImportedQueryDefinition,
  ObjectDefinition,
  PropertyDefinition,
  QueryDefinition,
  TypeInfoTransforms,
} from "@web3api/schema-parse";

interface PropertyDep {
  crate: string;
  type: string;
  isEnum: boolean;
}

interface PropertyDepsState {
  objectDefinition?: ObjectDefinition;
  queryDefinition?: QueryDefinition;
  importedQueryDefinition?: ImportedQueryDefinition;
  propertyDeps?: PropertyDep[];
}

export function propertyDeps(): TypeInfoTransforms {
  const state: PropertyDepsState = {};

  return {
    enter: {
      ObjectDefinition: (def: ObjectDefinition) => {
        state.objectDefinition = def;
        state.propertyDeps = [];
        return def;
      },
      QueryDefinition: (def: QueryDefinition) => {
        state.queryDefinition = def;
        state.propertyDeps = [];
        return def;
      },
      ImportedQueryDefinition: (def: ImportedQueryDefinition) => {
        state.importedQueryDefinition = def;
        state.propertyDeps = [];
        return def;
      },
      PropertyDefinition: (def: PropertyDefinition) => {
        const appendPropertyDep = (
          rootType: string,
          array: PropertyDep[]
        ): PropertyDep[] => {
          if (
            isBaseType(def.type) ||
            def.type.indexOf("[") === 0 ||
            def.type === rootType
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

          if (def.type === "BigInt") {
            appendUnique({
              crate: "num_bigint",
              type: "BigInt",
              isEnum: false,
            });
          } else {
            appendUnique({
              crate: "crate",
              type: def.type,
              isEnum: !!def.enum
            });
          }

          return array;
        };

        if (state.objectDefinition && state.propertyDeps) {
          state.propertyDeps = appendPropertyDep(
            state.objectDefinition.type,
            state.propertyDeps
          );
        } else if (state.queryDefinition && state.propertyDeps) {
          state.propertyDeps = appendPropertyDep(
            state.queryDefinition.type,
            state.propertyDeps
          );
        } else if (state.importedQueryDefinition && state.propertyDeps) {
          state.propertyDeps = appendPropertyDep(
            state.importedQueryDefinition.type,
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
      QueryDefinition: (def: QueryDefinition) => {
        const propertyDeps = state.propertyDeps;
        state.propertyDeps = undefined;
        state.queryDefinition = undefined;
        return {
          ...def,
          propertyDeps,
        };
      },
      ImportedQueryDefinition: (def: ImportedQueryDefinition) => {
        const propertyDeps = state.propertyDeps;
        state.propertyDeps = undefined;
        state.importedQueryDefinition = undefined;
        return {
          ...def,
          propertyDeps,
        };
      },
    },
  };
}
