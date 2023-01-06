import { ASTVisitor, EnumTypeDefinitionNode } from "graphql";
import { Abi, EnumDef } from "../definitions";
import { VisitorBuilder } from "./types";

export class EnumVisitorBuilder implements VisitorBuilder {
  build(abi: Abi): ASTVisitor {
    return {
      enter: {
        EnumTypeDefinition: (node: EnumTypeDefinitionNode) => {
          const def: EnumDef = {
            name: node.name.value,
            kind: "Enum",
            constants: node.values?.map(value => value.name.value) ?? []
          }

          abi.enums = abi.enums ? [...abi.enums, def] : [def];
        },
      },
    };
  }
}