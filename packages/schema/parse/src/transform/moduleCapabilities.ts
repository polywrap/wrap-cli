import { TypeInfoTransforms } from ".";
import {
  InterfaceDefinition,
  CapabilityDefinition,
  InvokableModules,
  TypeInfo,
} from "../typeInfo";

export interface ModuleCapability {
  type: string;
  uri: string;
  namespace: string;
}

export type ModuleCapabilityMap = Record<InvokableModules, ModuleCapability[]>;

const capitalize = (str: string) => str.replace(/^\w/, (c) => c.toUpperCase());

export function moduleCapabilities(): TypeInfoTransforms {
  const moduleCapabilities: ModuleCapabilityMap = {
    query: [],
    mutation: [],
  };

  const enabledInterfaces: Set<string> = new Set();

  return {
    enter: {
      InterfaceDefinition: (def: InterfaceDefinition) => {
        for (const type in def.capabilities) {
          const info = def.capabilities[type as keyof CapabilityDefinition];
          if (info.enabled) {
            for (const module of info.modules) {
              moduleCapabilities[module as InvokableModules].push({
                uri: def.uri,
                namespace: def.namespace,
                type,
              });
              enabledInterfaces.add(`${def.namespace}_${capitalize(module)}`);
            }
          }
        }
        return def;
      },
    },
    leave: {
      TypeInfo: (info: TypeInfo) => {
        for (const moduleDef of info.moduleTypes) {
          const module = moduleDef.type.toLowerCase() as InvokableModules;
          const capabilities = moduleCapabilities[module];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (moduleDef as any).capabilities = capabilities;
        }

        for (const importedModuleDef of info.importedModuleTypes) {
          if (enabledInterfaces.has(importedModuleDef.type)) {
            importedModuleDef.isInterface = true;
          }
        }

        return info;
      },
    },
  };
}
