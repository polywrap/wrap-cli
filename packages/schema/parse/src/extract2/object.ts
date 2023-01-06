import { ASTVisitor, FieldDefinitionNode, isScalarType, ObjectTypeDefinitionNode, TypeNode } from "graphql";
import { isModuleType, isEnvType } from "../abi";
import { Abi, AnyType, ObjectDef, PropertyDef, ScalarTypeName, UniqueDefKind } from "../definitions";
import { parseRef } from "../extract/utils/refParser";
import { parseAnnotateDirective } from "./directives";
import { VisitorBuilder } from "./types";

export const extractType = (node: TypeNode, uniqueDefs: Map<string, UniqueDefKind>): AnyType => {
  switch (node.kind) {
    case "NonNullType":
      return extractType(node.type, uniqueDefs)
    case "ListType":
      return {
        kind: "Array",
        required: node.type.kind === "NonNullType",
        item: extractType(node.type, uniqueDefs)
      }
    case "NamedType":
      if (isScalarType(node.name.value)) {
        return {
          kind: "Scalar",
          scalar: node.name.value as ScalarTypeName
        }
      }

      return parseRef(node.name.value, uniqueDefs)
  }
}

export class ObjectVisitorBuilder implements VisitorBuilder {
  constructor(protected readonly uniqueDefs: Map<string, UniqueDefKind>) { }

  protected extractPropertyDef(node: FieldDefinitionNode, uniqueDefs: Map<string, UniqueDefKind>): PropertyDef {
    if (node.directives) {
      for (const dir of node.directives) {
        if (dir.name.value === "annotate") {
          const map = parseAnnotateDirective(dir, uniqueDefs);

          return {
            kind: "Property",
            required: node.type.kind === "NonNullType",
            name: node.name.value,
            type: map
          }
        }
      }
    }
  
    return {
      kind: "Property",
      name: node.name.value,
      required: node.type.kind === "NonNullType",
      type: extractType(node.type, uniqueDefs)
    }
  }

  build(abi: Abi): ASTVisitor {
    return {
      enter: {
        ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
          const typeName = node.name.value;
      
          // Skip non-custom types
          if (isModuleType(typeName) || isEnvType(typeName)) {
            return;
          }

          // TODO: restore interfaces support
          // const interfaces = node.interfaces?.map((x) =>
          //   createInterfaceImplementedDefinition({ type: x.name.value })
          // );
      
          // Create a new TypeDefinition
          const def: ObjectDef = {
            kind: "Object",
            comment: node.description?.value,
            name: typeName,
            props: node.fields?.map(fieldNode => this.extractPropertyDef(fieldNode, this.uniqueDefs)) ?? []
          };
          
          abi.objects = abi.objects ? [...abi.objects, def] : [def];
        },
      },
    };
  }
}