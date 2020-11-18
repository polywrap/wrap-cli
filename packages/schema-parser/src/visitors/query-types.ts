import {
  TypeInfo,
  ArrayDefinition,
  PropertyDefinition,
  ScalarDefinition,
  QueryTypeDefinition,
  MethodDefinition
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

    const queryDef = new QueryTypeDefinition(
      nodeName, nodeName
    );
    typeInfo.queryTypes.push(queryDef);
    state.currentQuery = queryDef;
  },
  FieldDefinition: (node: FieldDefinitionNode) => {
    const queryDef = state.currentQuery;

    if (!queryDef) {
      return;
    }

    if (!node.arguments || node.arguments.length === 0) {
      throw Error("Imported types must only have methods");
    }

    const operation = queryDef.type === "Query" ? "query" : "mutation";
    const method = new MethodDefinition(
      operation, node.name.value
    );
    queryDef.methods.push(method);
    state.currentMethod = method;
  },
  InputValueDefinition: (node: InputValueDefinitionNode) => {
    const method = state.currentMethod;

    if (!method) {
      return;
    }

    const argument = new PropertyDefinition(node.name.value);
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
      argument.scalar = new ScalarDefinition(
        argument.name, modifier + node.name.value, state.nonNullType
      );
      state.nonNullType = false;
    } else if (method) {
      // Return value
      if (!method.return) {
        method.return = new PropertyDefinition(
          method.name
        );
        state.currentReturn = method.return;
      } else if (!state.currentReturn) {
        state.currentReturn = method.return;
      }
      state.currentReturn.scalar = new ScalarDefinition(
        method.name, modifier + node.name.value, state.nonNullType
      );
      state.nonNullType = false;
    }
  },
  ListType: (node: ListTypeNode) => {
    const argument = state.currentArgument;
    const method = state.currentMethod;

    if (method && argument) {
      // Argument value
      argument.array = new ArrayDefinition(
        argument.name, "TBD", state.nonNullType
      );
      state.currentArgument = argument.array;
      state.nonNullType = false;
    } else if (method) {
      // Return value
      if (!method.return) {
        method.return = new PropertyDefinition(
          method.name
        );
        state.currentReturn = method.return;
      } else if (!state.currentReturn) {
        state.currentReturn = method.return;
      }

      state.currentReturn.array = new ArrayDefinition(
        method.name, "TBD", state.nonNullType
      );
      state.currentReturn = state.currentReturn.array;
      state.nonNullType = false;
    }
  },
});

const visitorLeave = (typeInfo: TypeInfo, state: State) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
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
  },
});

export function visitQueryTypes(astNode: DocumentNode, typeInfo: TypeInfo) {
  const state: State = { };

  visit(astNode, {
    enter: visitorEnter(typeInfo, state),
    leave: visitorLeave(typeInfo, state)
  });
}
