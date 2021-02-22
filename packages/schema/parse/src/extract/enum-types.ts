import { TypeInfo, EnumDefinition, createEnumDefinition } from "../typeInfo";

import {
  DirectiveNode,
  DocumentNode,
  EnumTypeDefinitionNode,
  visit,
} from "graphql";

const visitorEnter = (enumTypes: EnumDefinition[]) => ({
  EnumTypeDefinition: (node: EnumTypeDefinitionNode) => {
    // Skip imported types
    if (
      node.directives &&
      node.directives.findIndex(
        (dir: DirectiveNode) => dir.name.value === "imported"
      ) > -1
    ) {
      return;
    }

    const constants: string[] = [];
    if (node.values) {
      for (const value of node.values) {
        constants.push(value.name.value);
      }
    }

    const enumType = createEnumDefinition({
      type: node.name.value,
      constants,
    });
    enumTypes.push(enumType);
  },
});

export function extractEnumTypes(
  astNode: DocumentNode,
  typeInfo: TypeInfo
): void {
  visit(astNode, {
    enter: visitorEnter(typeInfo.enumTypes),
  });
}
