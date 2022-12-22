import {
  isEnvType,
  isModuleType,
} from "..";

import {
  ObjectTypeDefinitionNode,
  FieldDefinitionNode,
  DirectiveNode,
  ASTVisitor,
  StringValueNode,
  TypeNode,
} from "graphql";
import { ObjectDefinition, Abi as WrapAbi, ObjectProperty, Reference, EnumDefinition } from "../definitions";
import { parseMapReference } from "./utils/map-utils";

const extractObjectProperty = (node: FieldDefinitionNode, enumDefs: string[]): ObjectProperty => {
  const extractType = (node: TypeNode, required = false): Reference => {
    switch (node.kind) {
      case "NonNullType":
        return extractType(node.type, true)
      case "ListType":
        return {
          kind: "Array",
          required,
          definition: {
            kind: "Array",
            items: extractType(node.type),
            name: "",
          }
        }
      case "NamedType":
        return {
          required,
          kind: enumDefs.includes(node.name.value) ? "Enum" : "Object",
          type: node.name.value
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
          name: node.name.value,
          type: parseMapReference(typeName, enumDefs)
        }
      }
    }
  }

  return {
    name: node.name.value,
    type: extractType(node.type)
  }
}

const visitorEnter = (objectTypes: ObjectDefinition[], enumDefs: EnumDefinition[]) => ({
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
    const type = {
      kind: "Object" as const,
      comment: node.description?.value,
      name: typeName,
      properties: node.fields?.map(fieldNode => extractObjectProperty(fieldNode, enumDefs.map(e => e.name))) ?? []
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
