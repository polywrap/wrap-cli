import {
  TypeInfo,
  createImportedEnumDefinition,
  ImportedEnumDefinition,
} from "../typeInfo";
import { extractImportedDefinition } from "./imported-types-utils";

import { DocumentNode, EnumTypeDefinitionNode, visit } from "graphql";

const visitorEnter = (importedEnumTypes: ImportedEnumDefinition[]) => ({
  EnumTypeDefinition: (node: EnumTypeDefinitionNode) => {
    const constants: string[] = [];
    const imported = extractImportedDefinition(node);

    if (!imported) {
      return;
    }

    if (node.values) {
      for (const value of node.values) {
        constants.push(value.name.value);
      }
    }

    const enumType = createImportedEnumDefinition({
      type: node.name.value,
      constants,
      uri: imported.uri,
      namespace: imported.namespace,
      nativeType: imported.nativeType,
    });
    importedEnumTypes.push(enumType);
  },
});

export function extractImportedEnumTypes(
  astNode: DocumentNode,
  typeInfo: TypeInfo
): void {
  visit(astNode, {
    enter: visitorEnter(typeInfo.importedEnumTypes),
  });
}
