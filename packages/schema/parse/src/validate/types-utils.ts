import { DocumentNode, NamedTypeNode, visit } from "graphql";

export interface Usage {
  name: string;
  type: string;
}

export const isOperationType = (typeName: string): boolean => {
  const operationTypes = ["Query", "Mutation", "Subscription"];
  const isOperation = operationTypes.some(
    (operationType) =>
      typeName.endsWith(`_${operationType}`) || operationType === typeName
  );

  return isOperation;
};

export const setOperationTypeUsages = (
  namedTypeNode: NamedTypeNode,
  propName: string,
  usages: Usage[]
): void => {
  const typeName = namedTypeNode.name.value;

  const isOperation = isOperationType(typeName);

  if (isOperation) {
    usages.push({ type: typeName, name: propName });
  }
};

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
