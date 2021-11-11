import { TypeInfoTransforms } from ".";
import {
  InterfaceDefinition,
  CapabilityDefinition,
  InvokableModules,
  TypeInfo,
} from "../typeInfo";

export interface QueryModuleCapability {
  type: string;
  uri: string;
  namespace: string;
}

export type QueryModuleCapabilityMap = Record<
  InvokableModules,
  QueryModuleCapability[]
>;

export function queryModuleCapabilities(): TypeInfoTransforms {
  const queryModuleCapabilities: QueryModuleCapabilityMap = {
    query: [],
    mutation: [],
  };

  return {
    enter: {
      InterfaceDefinition: (def: InterfaceDefinition) => {
        for (const type in def.capabilities) {
          const info = def.capabilities[type as keyof CapabilityDefinition];
          // console.log("HERERE", type, JSON.stringify(info, null, 2));
          if (info.enabled) {
            for (const module of info.modules) {
              queryModuleCapabilities[module as InvokableModules].push({
                uri: def.uri,
                namespace: def.namespace,
                type,
              });
            }
          }
          // console.log("AFTER", JSON.stringify(queryModuleCapabilities, null, 2));
        }
        return def;
      },
    },
    leave: {
      TypeInfo: (info: TypeInfo) => {
        // console.log("TYPEINFO", JSON.stringify(queryModuleCapabilities, null, 2));
        // console.log(info.queryTypes.length);
        for (const queryDef of info.queryTypes) {
          const module = queryDef.type.toLowerCase() as InvokableModules;
          const capabilities = queryModuleCapabilities[module];
          (queryDef as any).capabilities = capabilities;
        }

        // for (const query of info.queryTypes) {
        //   console.log(query.type, JSON.stringify((query as any).capabilities, null, 2));
        // }

        return info;
      },
    },
  };
}
