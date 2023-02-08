import { ASTVisitor, FieldDefinitionNode, ObjectTypeDefinitionNode } from "graphql";
import { isModuleType } from "../abi";
import { Abi, ObjectDef, PropertyDef, UniqueDefKind } from "../definitions";
import { parseDirectivesInField } from "./directives";
import { VisitorBuilder } from "./types";
import { extractType } from "./utils";

export class ObjectVisitorBuilder implements VisitorBuilder {
  constructor(protected readonly uniqueDefs: Map<string, UniqueDefKind>) { }

  protected extractPropertyDef(node: FieldDefinitionNode, uniqueDefs: Map<string, UniqueDefKind>): PropertyDef {
    const { map } = parseDirectivesInField(node, uniqueDefs)
  
    return {
      kind: "Property",
      name: node.name.value,
      required: node.type.kind === "NonNullType",
      type: map ?? extractType(node.type, uniqueDefs)
    }
  }

  build(abi: Abi): ASTVisitor {
    return {
      enter: {
        ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
          const typeName = node.name.value;
      
          // Skip non-custom types
          if (isModuleType(typeName)) {
            return;
          }
      
          // Create a new TypeDefinition
          const def: ObjectDef = {
            kind: "Object",
            name: typeName,
            props: node.fields?.map(fieldNode => this.extractPropertyDef(fieldNode, this.uniqueDefs)) ?? []
          };
          
          abi.objects = abi.objects ? [...abi.objects, def] : [def];
        },
      },
    };
  }
}