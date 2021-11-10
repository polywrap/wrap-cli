import { TypeInfoTransforms } from ".";
import {
  InterfaceDefinition,
  CapabilityDefinition,
  InvokableModules,
  TypeInfo
} from "../typeInfo";

export function queryModuleCapabilities(): TypeInfoTransforms {
  const queryModuleCapabilities: Record<
    InvokableModules,
    {
      type: string;
      uri: string;
      namespace: string;
    }[]
  > = {
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
          (queryDef as any).capabilities = capabilities;
        }

        return info;
      },
    },
  };
}
