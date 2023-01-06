import { ASTVisitor, ObjectTypeDefinitionNode } from "graphql";
import { isEnvType } from "../abi";
import { Abi, EnvDef } from "../definitions";
import { ObjectVisitorBuilder } from "./object";

export class EnvVisitorBuilder extends ObjectVisitorBuilder {
  build(abi: Abi): ASTVisitor {
    return {
      enter: {
        ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
          const typeName = node.name.value;

          if (!isEnvType(typeName)) {
            return;
          }
          
          const def: EnvDef = {
            kind: "Env",
            name: "Env",
            comment: node.description?.value,
            props: node.fields?.map(fieldNode => this.extractPropertyDef(fieldNode, this.uniqueDefs)) ?? []
          };
          
          abi.env = def;
        },
      },
    };
  }
}