import {
  TypeInfo,
  PropertyDefinition,
  QueryTypeDefinition,
  MethodDefinition, createQueryTypeDefinition, createMethodDefinition, createPropertyDefinition, createScalarDefinition, createArrayDefinition,
} from "../types";

import {
  DocumentNode,
  ObjectTypeDefinitionNode,
  NonNullTypeNode,
  NamedTypeNode,
  ListTypeNode,
  FieldDefinitionNode,
  InputValueDefinitionNode,
  visit
} from "graphql";

import { finalizeQueryType } from "./utils";

interface State {
  currentQuery?: QueryTypeDefinition
  currentMethod?: MethodDefinition
  currentArgument?: PropertyDefinition
  currentReturn?: PropertyDefinition
  nonNullType?: boolean
}

const visitorEnter = (typeInfo: TypeInfo, state: State) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    const nodeName = node.name.value;

    if (nodeName !== "Query" && nodeName !== "Mutation") {
      return;
    }

    const query = createQueryTypeDefinition(nodeName, nodeName);
    typeInfo.queryTypes.push(query);
    state.currentQuery = query;
  },
  FieldDefinition: (node: FieldDefinitionNode) => {
    const query = state.currentQuery;

    if (!query) {
      return;
    }

    if (!node.arguments || node.arguments.length === 0) {
      throw Error("Imported types must only have methods");
    }

    const operation = query.type === "Query" ? "query" : "mutation";
    const method = createMethodDefinition(operation, node.name.value);
    query.methods.push(method);
    state.currentMethod = method;
  },
  InputValueDefinition: (node: InputValueDefinitionNode) => {
    const method = state.currentMethod;

    if (!method) {
      return;
    }

    const argument = createPropertyDefinition(node.name.value);
    method.arguments.push(argument);
    state.currentArgument = argument;
  },
  NonNullType: (node: NonNullTypeNode) => {
    state.nonNullType = true;
  },
  NamedType: (node: NamedTypeNode) => {
    const argument = state.currentArgument;
    const method = state.currentMethod;
    const modifier = state.nonNullType ? "" : "?";

    if (method && argument) {
      // Argument value
      argument.scalar = createScalarDefinition(argument.name, modifier + node.name.value, state.nonNullType);
      state.nonNullType = false;
    } else if (method) {
      // Return value
      if (!method.return) {
        method.return = createPropertyDefinition(method.name);
        state.currentReturn = method.return;
      } else if (!state.currentReturn) {
        state.currentReturn = method.return;
      }
      state.currentReturn.scalar = createScalarDefinition(method.name, modifier + node.name.value, state.nonNullType);
      state.nonNullType = false;
    }
  },
  ListType: (node: ListTypeNode) => {
    const argument = state.currentArgument;
    const method = state.currentMethod;

    if (method && argument) {
      // Argument value
      argument.array = createArrayDefinition(argument.name, "TBD", state.nonNullType);
      state.currentArgument = argument.array;
      state.nonNullType = false;
    } else if (method) {
      // Return value
      if (!method.return) {
        method.return = createPropertyDefinition(method.name);
        state.currentReturn = method.return;
      } else if (!state.currentReturn) {
        state.currentReturn = method.return;
      }

      state.currentReturn.array = createArrayDefinition(method.name, "TBD", state.nonNullType);
      state.currentReturn = state.currentReturn.array;
      state.nonNullType = false;
    }
  },
});

const visitorLeave = (typeInfo: TypeInfo, state: State) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    if (state.currentQuery) {
      finalizeQueryType(state.currentQuery);
    }
    state.currentQuery = undefined;
  },
  FieldDefinition: (node: FieldDefinitionNode) => {
    state.currentMethod = undefined;
    state.currentReturn = undefined;
  },
  InputValueDefinition: (node: InputValueDefinitionNode) => {
    state.currentArgument = undefined;
  },
  NonNullType: (node: NonNullTypeNode) => {
    state.nonNullType = false;
  }
});

export function visitQueryTypes(astNode: DocumentNode, typeInfo: TypeInfo) {
  const state: State = { };

  visit(astNode, {
    enter: visitorEnter(typeInfo, state),
    leave: visitorLeave(typeInfo, state)
  });
}
