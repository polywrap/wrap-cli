import { AbiTransforms } from ".";

import {
  ModuleDefinition,
  ObjectDefinition,
  WrapAbi,
} from "@polywrap/wrap-manifest-types-js";

export function interfaceUris(): AbiTransforms {
  const uniqueInterfaceUris: Record<string, boolean> = {};
  const uniqueModuleInterfaceTypes: Record<string, boolean> = {};
  const uniqueObjectInterfaceTypes: Record<string, boolean> = {};

  return {
    enter: {
      ModuleDefinition: (def: ModuleDefinition) => {
        if (def.interfaces) {
          for (const interfaceDef of def.interfaces) {
            uniqueModuleInterfaceTypes[interfaceDef.type] = true;
          }
        }
        return def;
      },
      ObjectDefinition: (def: ObjectDefinition) => {
        if (def.interfaces) {
          for (const interfaceDef of def.interfaces) {
            uniqueObjectInterfaceTypes[interfaceDef.type] = true;
          }
        }
        return def;
      },
    },
    leave: {
      Abi: (abi: WrapAbi) => {
        for (const interfaceType of Object.keys(uniqueModuleInterfaceTypes)) {
          const importedInterface =
            abi.importedModuleTypes &&
            abi.importedModuleTypes.find(
              (importedModule) => importedModule.type === interfaceType
            );

          if (importedInterface) {
            uniqueInterfaceUris[importedInterface.uri] = true;
          }
        }

        for (const interfaceType of Object.keys(uniqueObjectInterfaceTypes)) {
          const importedInterface =
            abi.importedObjectTypes &&
            abi.importedObjectTypes.find(
              (importedObject) => importedObject.type === interfaceType
            );

          if (importedInterface) {
            uniqueInterfaceUris[importedInterface.uri] = true;
          }
        }

        return {
          ...abi,
          interfaceUris: Object.keys(uniqueInterfaceUris),
        };
      },
    },
  };
}
