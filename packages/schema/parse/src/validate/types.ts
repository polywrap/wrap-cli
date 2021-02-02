import { extractUserTypeDefinitions } from "./types-utils";

import { DocumentNode, visit } from "graphql";

const nativeTypes = ["Int", "Float", "String", "Boolean", "ID"];
const operationTypes = ["Query", "Mutation", "Subscription"];

interface Usage {
  name: string;
  type: string;
}

export function validateTypes(astNode: DocumentNode): void {
  const userDefinedTypes = extractUserTypeDefinitions(astNode);
  const supportedTypes = nativeTypes.concat(userDefinedTypes);
  const operationUsages: Usage[] = [];
  const unsupportedUsages: Usage[] = [];

  visit(astNode, {
    enter: {
      FieldDefinition: (fieldDefinitionNode) => {
        const fieldName = fieldDefinitionNode.name.value;
        visit(fieldDefinitionNode.type, {
          NamedType: (namedTypeNode) => {
            const typeName = namedTypeNode.name.value;

            if (!supportedTypes.includes(typeName)) {
              unsupportedUsages.push({ type: typeName, name: fieldName });
            }

            const isOperation = operationTypes.some((operationType) =>
              typeName.endsWith(`_${operationType}`)
            );

            if (isOperation) {
              operationUsages.push({ type: typeName, name: fieldName });
            }
          },
        });
      },
    },
  });

  if (unsupportedUsages.length) {
    throw new Error(
      `Found the following usages of unsupported types for fields:${unsupportedUsages.map(
        ({ type, name }) => `\n- Field: "${name}", Type: "${type}"`
      )}`
    );
  }

  if (operationUsages.length) {
    throw new Error(
      `Fields cannot be of type Query, Mutation or Subscription. Found:${operationUsages.map(
        ({ type, name }) => `\n- Field: "${name}", Type: "${type}"`
      )}`
    );
  }
}
