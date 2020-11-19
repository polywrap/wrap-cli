import { GenericTransformPredicate } from "../transform";
import {
  MethodDefinition,
  ObjectDefinition,
  PropertyDefinition,
  QueryDefinition,
  GenericDefinition,
  DefinitionKind,
  isKind,
  TypeInfoVisitor
} from "../typeInfo";

const myVisitor: TypeInfoVisitor = {
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

function setFirstLast<T>(array: T[]): T[] {
  return array.map((item, index) => ({
    ...item,
    first: index === 0 ? true : null,
    last: index === array.length - 1 ? true : null
  }));
}

export const createSetFirstLastPredicate: () => GenericTransformPredicate = () => {
  let firstProperty: Maybe<PropertyDefinition>;
  let lastProperty: Maybe<PropertyDefinition>;

  let firstArgument: Maybe<PropertyDefinition>;
  let lastArgument: Maybe<PropertyDefinition>;

  let firstMethod: Maybe<MethodDefinition>;
  let lastMethod: Maybe<MethodDefinition>;

  return (definition: GenericDefinition) => {

    if (isKind(definition, DefinitionKind.Object)) {
      const obj = definition as ObjectDefinition;
      firstProperty = obj.properties[0];
      lastProperty = obj.properties[obj.properties.length - 1];
      return {};
    }

    if (isKind(definition, DefinitionKind.Method)) {
      const method = definition as MethodDefinition;

      const fieldsToAdd: any = {};

      if (method === firstMethod) {
        firstMethod = undefined;
        fieldsToAdd.first = true;
      }

      if (method === lastMethod) {
        lastMethod = undefined;
        fieldsToAdd.last = true;
      }

      firstArgument = method.arguments[0];
      lastArgument = method.arguments[method.arguments.length - 1];
      return fieldsToAdd;
    }

    if (definition.kind === DefinitionKind.Property) {
      const fieldsToAdd: any = {};

      // resetting as undefined is probably un-necessary
      // and would simplify this code, but i'd rather be safe

      if (definition === firstProperty) {
        firstProperty = undefined;
        fieldsToAdd.first = true;
      }
      if (definition === lastProperty) {
        lastProperty = undefined;
        fieldsToAdd.last = true;
      }

      if (definition === firstArgument) {
        firstArgument = undefined;
        fieldsToAdd.first = true;
      }
      if (definition === lastArgument) {
        lastArgument = undefined;
        fieldsToAdd.last = true;
      }

      return fieldsToAdd;
    }

    if (isKind(definition, DefinitionKind.Query)) {
      const query = definition as QueryDefinition;
      firstMethod = query.methods[0];
      lastMethod = query.methods[query.methods.length - 1];

      return {};
    }

    return {};
  }
}
