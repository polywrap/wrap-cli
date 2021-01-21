import {
  PropertyDefinition,
  ImportedQueryDefinition,
  MethodDefinition,
  createPropertyDefinition,
  QueryDefinition,
  createObjectDefinition,
  createScalarDefinition,
  createArrayDefinition,
  isScalar,
} from "../typeInfo";

import { InputValueDefinitionNode, NamedTypeNode } from "graphql";

export interface State {
  currentQuery?: QueryDefinition;
  currentMethod?: MethodDefinition;
  currentArgument?: PropertyDefinition;
  currentReturn?: PropertyDefinition;
  nonNullType?: boolean;
  currentImport?: ImportedQueryDefinition;
}

export function extractNamedType(node: NamedTypeNode, state: State): void {
  const argument = state.currentArgument;
  const method = state.currentMethod;
  const modifier = state.nonNullType ? "" : "?";

  if (method && argument) {
    // Argument value
    if (isScalar(node.name.value)) {
      argument.scalar = createScalarDefinition(
        argument.name,
        modifier + node.name.value,
        state.nonNullType
      );
    } else {
      argument.object = createObjectDefinition(
        argument.name,
        modifier + node.name.value,
        state.nonNullType
      );
    }

    state.nonNullType = false;
  } else if (method) {
    // Return value
    if (!method.return) {
      method.return = createPropertyDefinition(method.name);

      state.currentReturn = method.return;
    } else if (!state.currentReturn) {
      state.currentReturn = method.return;
    }

    if (isScalar(node.name.value)) {
      state.currentReturn.scalar = createScalarDefinition(
        method.name,
        modifier + node.name.value,
        state.nonNullType
      );
    } else {
      state.currentReturn.object = createObjectDefinition(
        method.name,
        modifier + node.name.value,
        state.nonNullType
      );
    }
    state.nonNullType = false;
  }
}

export function extractListType(state: State): void {
  const argument = state.currentArgument;
  const method = state.currentMethod;

  if (method && argument) {
    // Argument value
    argument.array = createArrayDefinition(
      argument.name,
      "TBD",
      state.nonNullType
    );
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

    state.currentReturn.array = createArrayDefinition(
      method.name,
      "TBD",
      state.nonNullType
    );
    state.currentReturn = state.currentReturn.array;
    state.nonNullType = false;
  }
}

export function extractInputValueDefinition(
  node: InputValueDefinitionNode,
  state: State
): void {
  const method = state.currentMethod;

  if (!method) {
    return;
  }

  const argument = createPropertyDefinition(node.name.value);
  method.arguments.push(argument);
  state.currentArgument = argument;
}
