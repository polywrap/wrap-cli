import {
  extractUserTypeDefinitions,
  setOperationTypeUsages,
  Usage,
} from "./types-utils";

import { DocumentNode, visit } from "graphql";

const NATIVE_TYPES = ["Int", "Float", "String", "Boolean", "ID"];

export function validateTypes(astNode: DocumentNode): void {
  const userDefinedTypes = extractUserTypeDefinitions(astNode);
  const supportedTypes = NATIVE_TYPES.concat(userDefinedTypes);
  const unsupportedUsages: Usage[] = [];
  const argumentOperationUsages: Usage[] = [];

  visit(astNode, {
    enter: {
      FieldDefinition: (fieldDefinitionNode) => {
        const fieldName = fieldDefinitionNode.name.value;

        fieldDefinitionNode.arguments?.forEach((argument) => {
          visit(argument.type, {
            NamedType: (namedTypeNode) =>
              setOperationTypeUsages(
                namedTypeNode,
                argument.name.value,
                argumentOperationUsages
              ),
          });
        });

        visit(fieldDefinitionNode.type, {
          NamedType: (namedTypeNode) => {
            const typeName = namedTypeNode.name.value;

            if (!supportedTypes.includes(typeName)) {
              unsupportedUsages.push({ type: typeName, name: fieldName });
            }

            setOperationTypeUsages(
              namedTypeNode,
              fieldDefinitionNode.name.value,
              unsupportedUsages
            );
          },
        });
      },
    },
  });

  if (unsupportedUsages.length) {
    throw new Error(
      `Found the following usages of unsupported or operation types for fields:${unsupportedUsages.map(
        ({ type, name }) => `\n- Field: "${name}", Type: "${type}"`
      )}`
    );
  }

  if (argumentOperationUsages.length) {
    throw new Error(
      `Field arguments cannot be of type Query, Mutation or Subscription. Found:${argumentOperationUsages.map(
        ({ type, name }) => `\n- Argument: "${name}", Type: "${type}"`
      )}`
    );
  }
}
