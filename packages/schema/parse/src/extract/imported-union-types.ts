import {
  TypeInfo,
  ImportedUnionDefinition,
  createImportedUnionDefinition,
  createObjectRef,
} from "../typeInfo";
import { extractImportedDefinition } from "./utils/imported-types-utils";

import { ASTVisitor, UnionTypeDefinitionNode } from "graphql";

const visitorEnter = (importedUnionTypes: ImportedUnionDefinition[]) => ({
  UnionTypeDefinition: (node: UnionTypeDefinitionNode) => {
    const imported = extractImportedDefinition(node);

    if (!imported) {
      return;
    }

    const union = createImportedUnionDefinition({
      type: node.name.value,
      memberTypes: node.types
        ? node.types.map((type) =>
            createObjectRef({
              type: type.name.value,
            })
          )
        : [],
      uri: imported.uri,
      namespace: imported.namespace,
      nativeType: imported.nativeType,
      comment: node.description?.value,
    });

    importedUnionTypes.push(union);
  },
});

export const getImportedUnionTypesVisitor = (
  typeInfo: TypeInfo
): ASTVisitor => ({
  enter: visitorEnter(typeInfo.importedUnionTypes),
});
