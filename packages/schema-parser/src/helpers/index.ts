import { GenericTransformPredicate } from "../transform";
import { MethodDefinition, ObjectTypeDefinition, PropertyDefinition, QueryTypeDefinition, TypeDefinition, TypeDefinitionKind } from "../types";

export const createSetFirstLastPredicate: () => GenericTransformPredicate = () => {
  let firstProperty: Maybe<PropertyDefinition>;
  let lastProperty: Maybe<PropertyDefinition>;

  let firstArgument: Maybe<PropertyDefinition>;
  let lastArgument: Maybe<PropertyDefinition>;

  let firstMethod: Maybe<MethodDefinition>;
  let lastMethod: Maybe<MethodDefinition>;

  return (definition: TypeDefinition) => {

    if (definition.kind === TypeDefinitionKind.Object || definition.kind === TypeDefinitionKind.ImportedObject) {
      const obj = definition as ObjectTypeDefinition;
      firstProperty = obj.properties[0];
      lastProperty = obj.properties[obj.properties.length - 1];
      return {};
    }

    if (definition.kind === TypeDefinitionKind.Method) {
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

    if (definition.kind === TypeDefinitionKind.Property) {
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

    if (definition.kind === TypeDefinitionKind.Query || definition.kind === TypeDefinitionKind.ImportedQuery) {
      const query = definition as QueryTypeDefinition;
      firstMethod = query.methods[0];
      lastMethod = query.methods[query.methods.length - 1];

      return {};
    }

    return {};
  }
}
