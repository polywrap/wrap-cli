import { TypeInfoTransforms } from ".";
import { TypeInfo, QueryDefinition, ObjectDefinition } from "../typeInfo";

export function interfaceUris(): TypeInfoTransforms {
  const uniqueInterfaceUris: Record<string, boolean> = {};
  const uniqueQueryInterfaceTypes: Record<string, boolean> = {};
  const uniqueObjectInterfaceTypes: Record<string, boolean> = {};

  return {
    enter: {
      QueryDefinition: (def: QueryDefinition) => {
        for (const interfaceDef of def.interfaces) {
          uniqueQueryInterfaceTypes[interfaceDef.type] = true;
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
        for (const interfaceType of Object.keys(uniqueQueryInterfaceTypes)) {
          const importedInterface = typeInfo.importedQueryTypes.find(
            (importedQuery) => importedQuery.type === interfaceType
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
