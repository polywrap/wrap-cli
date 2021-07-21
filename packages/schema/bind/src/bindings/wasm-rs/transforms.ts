/* eslint-disable @typescript-eslint/naming-convention */
import { isBaseType } from "./types";

import {
  ImportedQueryDefinition,
  ObjectDefinition,
  PropertyDefinition,
  QueryDefinition,
  TypeInfoTransforms,
} from "@web3api/schema-parse";

interface CrateAndType {
  crate: string;
  type: string;
}

interface IPropertyTypesState {
  objectDefinition?: ObjectDefinition;
  queryDefinition?: QueryDefinition;
  importedQueryDefinition?: ImportedQueryDefinition;
  propertyTypes?: CrateAndType[];
}

export function propertyTypes(): TypeInfoTransforms {
  const state: IPropertyTypesState = {};

  return {
    enter: {
      ObjectDefinition: (def: ObjectDefinition) => {
        state.objectDefinition = def;
        state.propertyTypes = [];
        return def;
      },
      QueryDefinition: (def: QueryDefinition) => {
        state.queryDefinition = def;
        state.propertyTypes = [];
        return def;
      },
      ImportedQueryDefinition: (def: ImportedQueryDefinition) => {
        state.importedQueryDefinition = def;
        state.propertyTypes = [];
        return def;
      },
      PropertyDefinition: (def: PropertyDefinition) => {
        const appendCrateAndType = (
          rootType: string,
          array: CrateAndType[]
        ): CrateAndType[] => {
          if (
            isBaseType(def.type) ||
            def.type.indexOf("[") === 0 ||
            def.type.indexOf("Enum_") === 0 ||
            def.type === rootType
          ) {
            return array;
          }

          const appendUnique = (item: CrateAndType) => {
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
              crate: "big_int",
              type: "BigInt",
            });
          } else {
            appendUnique({
              crate: "crate",
              type: def.type,
            });
          }

          return array;
        };

        if (state.objectDefinition && state.propertyTypes) {
          state.propertyTypes = appendCrateAndType(
            state.objectDefinition.type,
            state.propertyTypes
          );
        } else if (state.queryDefinition && state.propertyTypes) {
          state.propertyTypes = appendCrateAndType(
            state.queryDefinition.type,
            state.propertyTypes
          );
        } else if (state.importedQueryDefinition && state.propertyTypes) {
          state.propertyTypes = appendCrateAndType(
            state.importedQueryDefinition.type,
            state.propertyTypes
          );
        }

        return def;
      },
    },
    leave: {
      ObjectDefinition: (def: ObjectDefinition) => {
        const propertyTypes = state.propertyTypes;
        state.propertyTypes = undefined;
        state.objectDefinition = undefined;
        return {
          ...def,
          propertyTypes,
        };
      },
      QueryDefinition: (def: QueryDefinition) => {
        const propertyTypes = state.propertyTypes;
        state.propertyTypes = undefined;
        state.queryDefinition = undefined;
        return {
          ...def,
          propertyTypes,
        };
      },
      ImportedQueryDefinition: (def: ImportedQueryDefinition) => {
        const propertyTypes = state.propertyTypes;
        state.propertyTypes = undefined;
        state.importedQueryDefinition = undefined;
        return {
          ...def,
          propertyTypes,
        };
      },
    },
  };
}
