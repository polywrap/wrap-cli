import {
  createObjectRef,
  createUnionDefinition,
  TypeInfo,
  UnionDefinition,
} from "../typeInfo";

import { ASTVisitor, UnionTypeDefinitionNode } from "graphql";

const visitorEnter = (unionTypes: UnionDefinition[]) => ({
  UnionTypeDefinition: (node: UnionTypeDefinitionNode) => {
    if (
      node.directives &&
      node.directives.findIndex((dir) => dir.name.value === "imported") > -1
    ) {
      return;
    }

    const union = createUnionDefinition({
      type: node.name.value,
      comment: node.description?.value,
      memberTypes: node.types
        ? node.types.map((type) =>
            createObjectRef({
              type: type.name.value,
            })
          )
        : [],
    });

    unionTypes.push(union);
  },
});

export const getUnionTypesVisitor = (typeInfo: TypeInfo): ASTVisitor => ({
  enter: visitorEnter(typeInfo.unionTypes),
});
