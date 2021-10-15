import {
  createGenericDefinition,
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
      type: "Union",
      name: node.name.value,
      unionTypes: node.types
        ? node.types.map((type) =>
            createGenericDefinition({
              type: type.name.value,
            })
          )
        : [],
    });

    unionTypes.push(union);

    console.log(JSON.stringify(unionTypes, null, 2));
  },
});

export const getUnionTypesVisitor = (typeInfo: TypeInfo): ASTVisitor => ({
  enter: visitorEnter(typeInfo.unionTypes),
});
