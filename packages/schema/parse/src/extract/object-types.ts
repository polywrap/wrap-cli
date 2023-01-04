import {
  isEnvType,
  isModuleType,
  isScalarType,
} from "..";

import {
  ObjectTypeDefinitionNode,
  FieldDefinitionNode,
  DirectiveNode,
  ASTVisitor,
  StringValueNode,
  TypeNode,
} from "graphql";
import { ObjectDef, Abi as WrapAbi, PropertyDef, AnyType, EnumDef, ScalarTypeName } from "../definitions";
import { parseMapReference } from "./utils/map-utils";

const extractPropertyDef = (node: FieldDefinitionNode, enumDefs: string[]): PropertyDef => {
  // const extractType = (node: TypeNode, required = false): AnyType => {
  //   switch (node.kind) {
  //     case "NonNullType":
  //       return extractType(node.type, true)
  //     case "ListType":
  //       return {
  //         kind: "Array",
  //         item: extractType(node.type),
  //         required
  //       }
  //     case "NamedType":
  //       return {
  //         kind: "Ref",
  //         // TODO: Revisit this condition as it is not future proof
  //         ref_kind: enumDefs.includes(node.name.value) ? "Enum" : "Object",
  //         ref_name: node.name.value
  //       }
  //   }
  // }

  const extractType = (node: TypeNode): AnyType => {
    switch (node.kind) {
      case "NonNullType":
        return extractType(node.type)
      case "ListType":
        return {
          kind: "Array",
          required: node.type.kind === "NonNullType",
          item: extractType(node.type)
        }
      case "NamedType":
        if (isScalarType(node.name.value)) {
          return {
            kind: "Scalar",
            scalar: node.name.value as ScalarTypeName
          }
        }

        return {
          kind: "Ref",
          // TODO: Revisit this condition as it is not future proof
          ref_kind: enumDefs.includes(node.name.value) ? "Enum" : "Object",
          ref_name: node.name.value
        }
    }
  }

  if (node.directives) {
    for (const dir of node.directives) {
      if (dir.name.value === "annotate") {
        const typeName = (dir.arguments?.find((arg) => arg.name.value === "type")
          ?.value as StringValueNode).value;
        if (!typeName) {
          throw new Error(
            `Annotate directive: ${node.name.value} has invalid arguments`
          );
        }
        return {
          kind: "Property",
          required: node.type.kind === "NonNullType",
          name: node.name.value,
          type: parseMapReference(typeName, enumDefs)
        }
      }
    }
  }

  return {
    kind: "Property",
    name: node.name.value,
    required: node.type.kind === "NonNullType",
    type: extractType(node.type)
  }
}

const visitorEnter = (objectTypes: ObjectDef[], enumDefs: EnumDef[]) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    const typeName = node.name.value;

    // Skip non-custom types
    if (isModuleType(typeName) || isEnvType(typeName)) {
      return;
    }

    // Skip imported types
    if (
      node.directives &&
      node.directives.findIndex(
        (dir: DirectiveNode) => dir.name.value === "imported"
      ) > -1
    ) {
      return;
    }

    // TODO: restore interfaces support
    // const interfaces = node.interfaces?.map((x) =>
    //   createInterfaceImplementedDefinition({ type: x.name.value })
    // );

    // Create a new TypeDefinition
    const type: ObjectDef = {
      kind: "Object",
      comment: node.description?.value,
      name: typeName,
      props: node.fields?.map(fieldNode => extractPropertyDef(fieldNode, enumDefs.map(e => e.name))) ?? []
    };
    objectTypes.push(type);
  },
});

export const getObjectTypesVisitor = (abi: WrapAbi): ASTVisitor => {
  return {
    // TODO: Ensure enums were extracted previously
    enter: visitorEnter(abi.objectTypes || [], abi.enumTypes),
  };
};
