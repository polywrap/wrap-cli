import { TypeInfoTransforms } from ".";
import { TypeInfo, ModuleDefinition, ObjectDefinition } from "../typeInfo";

export function interfaceUris(): TypeInfoTransforms {
  const uniqueInterfaceUris: Record<string, boolean> = {};
  const uniqueModuleInterfaceTypes: Record<string, boolean> = {};
  const uniqueObjectInterfaceTypes: Record<string, boolean> = {};

  return {
    enter: {
      ModuleDefinition: (def: ModuleDefinition) => {
        for (const interfaceDef of def.interfaces) {
          uniqueModuleInterfaceTypes[interfaceDef.type] = true;
        }
        return def;
      },
      ObjectDefinition: (def: ObjectDefinition) => {
        for (const interfaceDef of def.interfaces) {
          uniqueObjectInterfaceTypes[interfaceDef.type] = true;
        }
        return def;
      },
    },
    leave: {
      TypeInfo: (typeInfo: TypeInfo) => {
        for (const interfaceType of Object.keys(uniqueModuleInterfaceTypes)) {
          const importedInterface = typeInfo.importedModuleTypes.find(
            (importedModule) => importedModule.type === interfaceType
          );

          if (importedInterface) {
            uniqueInterfaceUris[importedInterface.uri] = true;
          }
        }

        for (const interfaceType of Object.keys(uniqueObjectInterfaceTypes)) {
          const importedInterface = typeInfo.importedObjectTypes.find(
            (importedObject) => importedObject.type === interfaceType
          );

          if (importedInterface) {
            uniqueInterfaceUris[importedInterface.uri] = true;
          }
        }

        return {
          ...typeInfo,
          interfaceUris: Object.keys(uniqueInterfaceUris),
        };
      },
    },
  };
}
