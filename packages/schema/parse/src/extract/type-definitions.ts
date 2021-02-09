import {
  DocumentNode,
  TypeDefinitionNode,
  visit,
  EnumTypeDefinitionNode,
} from "graphql";

export interface TypeDefinitions {
  enumTypes: string[];
  objectTypes: string[];
}

const visitorEnter = (typeDefinitions: TypeDefinitions) => ({
  ObjectTypeDefinition: (node: TypeDefinitionNode) => {
    typeDefinitions.objectTypes.push(node.name.value);
  },
  EnumTypeDefinition: (node: EnumTypeDefinitionNode) => {
    typeDefinitions.enumTypes.push(node.name.value);
  },
});

export function extractTypeDefinitions(astNode: DocumentNode): TypeDefinitions {
  const typeDefinitions = {
    enumTypes: [],
    objectTypes: [],
  };

  visit(astNode, {
    enter: visitorEnter(typeDefinitions),
  });

  return typeDefinitions;
}
