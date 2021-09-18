import {
  TypeInfo,
  QueryDefinition,
  createQueryDefinition,
  createMethodDefinition,
  createPropertyDefinition,
  createInterfaceImplementedDefinition,
} from "../typeInfo";
import {
  extractInputValueDefinition,
  extractListType,
  extractNamedType,
  State,
} from "./query-types-utils";

import {
  ObjectTypeDefinitionNode,
  NonNullTypeNode,
  NamedTypeNode,
  ListTypeNode,
  FieldDefinitionNode,
  InputValueDefinitionNode,
  DirectiveNode,
  ArgumentNode,
  ValueNode,
  ASTVisitor,
} from "graphql";

const visitorEnter = (queryTypes: QueryDefinition[], state: State) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    const nodeName = node.name.value;

    if (nodeName !== "Query" && nodeName !== "Mutation") {
      return;
    }

    const imports = parseImportsDirective(nodeName, node);

    const query = createQueryDefinition({
      type: nodeName,
      imports,
      interfaces: node.interfaces?.map((x) =>
        createInterfaceImplementedDefinition({ type: x.name.value })
      ),
      comment: node.description?.value,
    });
    queryTypes.push(query);
    state.currentQuery = query;
  },
  FieldDefinition: (node: FieldDefinitionNode) => {
    const query = state.currentQuery;

    if (!query) {
      return;
    }

    const returnType = createPropertyDefinition({
      type: "N/A",
      name: node.name.value,
    });

    const method = createMethodDefinition({
      type: query.type,
      name: node.name.value,
      return: returnType,
      comment: node.description?.value,
    });
    query.methods.push(method);
    state.currentMethod = method;
    state.currentReturn = returnType;
  },
  InputValueDefinition: (node: InputValueDefinitionNode) => {
    extractInputValueDefinition(node, state);
  },
  NonNullType: (_node: NonNullTypeNode) => {
    state.nonNullType = true;
  },
  NamedType: (node: NamedTypeNode) => {
    extractNamedType(node, state);
  },
  ListType: (_node: ListTypeNode) => {
    extractListType(state);
  },
});

const parseImportsDirective = (
  nodeName: string,
  node: ObjectTypeDefinitionNode
): { type: string }[] => {
  // Look for the imports directive, and gather imported types
  const imports: { type: string }[] = [];

  if (!node.directives) {
    return imports;
  }

  const importsIndex = node.directives.findIndex(
    (dir: DirectiveNode) => dir.name.value === "imports"
  );

  if (importsIndex !== -1) {
    const importsDir = node.directives[importsIndex];

    if (!importsDir.arguments) {
      throw Error(
        `@imports directive is incomplete, missing arguments. See type ${nodeName}.`
      );
    }

    const typesIndex = importsDir.arguments.findIndex(
      (arg: ArgumentNode) => arg.name.value === "types"
    );

    if (typesIndex === -1) {
      throw Error(
        `@imports directive missing required argument "types". See type ${nodeName}.`
      );
    }

    const typesArg = importsDir.arguments[typesIndex];

    if (typesArg.value.kind !== "ListValue") {
      throw Error(
        `@imports directive's types argument must be a List type. See type ${nodeName}.`
      );
    }

    const listValue = typesArg.value;

    listValue.values.forEach((value: ValueNode) => {
      if (value.kind !== "StringValue") {
        throw Error(
          `@imports directive's types list must only contain strings. See type ${nodeName}.`
        );
      }

      imports.push({ type: value.value });
    });
  }

  return imports;
};

const visitorLeave = (state: State) => ({
  ObjectTypeDefinition: (_node: ObjectTypeDefinitionNode) => {
    state.currentQuery = undefined;
  },
  FieldDefinition: (_node: FieldDefinitionNode) => {
    state.currentMethod = undefined;
    state.currentReturn = undefined;
  },
  InputValueDefinition: (_node: InputValueDefinitionNode) => {
    state.currentArgument = undefined;
  },
  NonNullType: (_node: NonNullTypeNode) => {
    state.nonNullType = false;
  },
});

export const getQueryTypesVisitor = (typeInfo: TypeInfo): ASTVisitor => {
  const state: State = {};

  return {
    enter: visitorEnter(typeInfo.queryTypes, state),
    leave: visitorLeave(state),
  };
};
