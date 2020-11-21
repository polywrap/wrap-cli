import { TypeInfoTransforms } from ".";
import {
  MethodDefinition,
  ObjectDefinition,
  QueryDefinition,
  TypeInfo
} from "../typeInfo";

export const addFirstLast: TypeInfoTransforms = {
  enter: {
    TypeInfo: (typeInfo: TypeInfo) => ({
      ...typeInfo,
      userTypes: setFirstLast(typeInfo.userTypes),
      queryTypes: setFirstLast(typeInfo.queryTypes),
      importedObjectTypes: setFirstLast(typeInfo.importedObjectTypes),
      importedQueryTypes: setFirstLast(typeInfo.importedQueryTypes)
    }),
    ObjectDefinition: (def: ObjectDefinition) => ({
      ...def,
      properties: setFirstLast(def.properties)
    }),
    MethodDefinition: (def: MethodDefinition) => ({
      ...def,
      arguments: setFirstLast(def.arguments)
    }),
    QueryDefinition: (def: QueryDefinition) => ({
      ...def,
      methods: setFirstLast(def.methods)
    })
  }
}

function setFirstLast<T>(array: T[]): T[] {
  return array.map((item, index) => ({
    ...item,
    first: index === 0 ? true : null,
    last: index === array.length - 1 ? true : null
  }));
}
