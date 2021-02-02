import { DocumentNode, visit } from "graphql";

export const extractUserTypeDefinitions = (astNode: DocumentNode): string[] => {
  const userDefinedTypes: string[] = [];

  visit(astNode, {
    enter: {
      EnumTypeDefinition: (node) => {
        userDefinedTypes.push(node.name.value);
      },
      ObjectTypeDefinition: (node) => {
        userDefinedTypes.push(node.name.value);
      },
      ScalarTypeDefinition: (node) => {
        userDefinedTypes.push(node.name.value);
      },
      OperationTypeDefinition: (node) => {
        userDefinedTypes.push(node.type.name.value);
      },
    },
  });

  return userDefinedTypes;
};
