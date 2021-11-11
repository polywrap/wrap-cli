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
          if (info.enabled) {
            for (const module of info.modules) {
              queryModuleCapabilities[module as InvokableModules].push({
                uri: def.uri,
                namespace: def.namespace,
                type,
              });
            }
          }
        }
        return def;
      },
    },
    leave: {
      TypeInfo: (info: TypeInfo) => {
        for (const queryDef of info.queryTypes) {
          const module = queryDef.type.toLowerCase() as InvokableModules;
          const capabilities = queryModuleCapabilities[module];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (queryDef as any).capabilities = capabilities;
        }

        return info;
      },
    },
  };
}
