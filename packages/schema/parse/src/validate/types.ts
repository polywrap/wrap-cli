import {
  isScalarType,
  scalarTypeNames,
  isQueryType,
  queryTypeNames,
} from "../typeInfo";

import { DocumentNode, StringValueNode, visit } from "graphql";

export function typeDefinitions(astNode: DocumentNode): void {
  const objectTypes: Record<string, boolean> = {};

  visit(astNode, {
    enter: {
      // No Interfaces
      InterfaceTypeDefinition: (node) => {
        throw Error(
          "Interface type definitions are not supported.\n" +
            `Found: interface ${node.name.value} { ... }\n` +
            `Please Use: type ${node.name.value} { ... }`
        );
      },
      // No Inputs
      InputObjectTypeDefinition: (node) => {
        throw Error(
          "Input type definitions are not supported.\n" +
            `Found: input ${node.name.value} { ... }\n` +
            `Please Use: type ${node.name.value} { ... }`
        );
      },
      ObjectTypeDefinition: (node) => {
        // No Subscriptions
        if (node.name.value === "Subscription") {
          throw Error(
            "Subscriptions are not yet supported. Please use Query or Mutation."
          );
        }

        // No duplicates
        if (objectTypes[node.name.value]) {
          throw Error(
            `Duplicate object type definition found: ${node.name.value}`
          );
        }

        objectTypes[node.name.value] = true;
      },
      // No New Scalars
      ScalarTypeDefinition: (node) => {
        if (!isScalarType(node.name.value)) {
          throw Error(
            `Custom scalar types are not supported. Supported scalars: ${scalarTypeNames}`
          );
        }
      },
      // No Unions
      UnionTypeDefinition: (node) => {
        throw Error(
          "Union type definitions are not supported.\n" +
            `Found: union ${node.name.value}`
        );
      },
    },
  });
}

export function propertyTypes(astNode: DocumentNode): void {
  let currentObject: string | undefined;
  let currentImportType: string | undefined;
  let currentField: string | undefined;
  const objectTypes: Record<string, boolean> = {};
  const enumTypes: Record<string, boolean> = {};
  const fieldTypes: {
    object: string;
    field: string;
    type: string;
  }[] = [];

  visit(astNode, {
    enter: {
      ObjectTypeDefinition: (node) => {
        currentObject = node.name.value;
        objectTypes[node.name.value] = true;
      },
      EnumTypeDefinition: (node) => {
        enumTypes[node.name.value] = true;
      },
      Directive: (node) => {
        if (node.name.value === "imported") {
          // save the imported native type name
          if (node.arguments) {
            const nativeType = node.arguments.find(
              (arg) => arg.name.value === "nativeType"
            );

            if (nativeType) {
              currentImportType = (nativeType.value as StringValueNode).value;
            }
          }
        }
      },
      FieldDefinition: (node) => {
        currentField = node.name.value;
      },
      NamedType: (node) => {
        if (currentObject && currentField) {
          fieldTypes.push({
            object: currentObject,
            field: currentField,
            type: node.name.value,
          });
        }
      },
      InputValueDefinition: (node) => {
        const typeName = currentImportType ? currentImportType : currentObject;
        if (typeName && !isQueryType(typeName)) {
          // Arguments not supported on non-query types
          throw Error(
            `Methods can only be defined on query types (${queryTypeNames.join(
              ", "
            )}).\n` +
              `Found: type ${typeName} { ${currentField}(${node.name.value}) }`
          );
        }
      },
    },
    leave: {
      ObjectTypeDefinition: () => {
        currentObject = undefined;
        currentImportType = undefined;
      },
      FieldDefinition: () => {
        currentField = undefined;
      },
    },
  });

  // Ensure all property types are either a
  // supported scalar, enum or an object type definition
  for (const field of fieldTypes) {
    if (
      !isScalarType(field.type) &&
      !objectTypes[field.type] &&
      !enumTypes[field.type]
    ) {
      throw Error(
        `Unknown property type found: type ${field.object} { ${field.field}: ${field.type} }`
      );
    }
  }
}
