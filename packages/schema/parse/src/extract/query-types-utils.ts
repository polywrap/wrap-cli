import {
  PropertyDefinition,
  ImportedQueryDefinition,
  MethodDefinition,
  createPropertyDefinition,
  QueryDefinition,
  createObjectDefinition,
  createScalarDefinition,
  createArrayDefinition,
  isScalarType,
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

  if (method && argument) {
    // Argument value
    if (isScalarType(node.name.value)) {
      argument.scalar = createScalarDefinition({
        name: argument.name,
        type: node.name.value,
        required: state.nonNullType,
      });
    } else {
      argument.object = createObjectDefinition({
        name: argument.name,
        type: node.name.value,
        required: state.nonNullType,
      });
    }

    state.nonNullType = false;
  } else if (method) {
    // Return value
    if (!method.return) {
      method.return = createPropertyDefinition({
        type: "N/A",
        name: method.name,
      });

      state.currentReturn = method.return;
    } else if (!state.currentReturn) {
      state.currentReturn = method.return;
    }

    if (isScalarType(node.name.value)) {
      state.currentReturn.scalar = createScalarDefinition({
        type: node.name.value,
        name: method.name,
        required: state.nonNullType,
      });
      state.currentReturn.type = state.currentReturn.scalar.type;
    } else {
      state.currentReturn.object = createObjectDefinition({
        type: node.name.value,
        name: method.name,
        required: state.nonNullType,
      });
      state.currentReturn.type = state.currentReturn.object.type;
    }
    state.nonNullType = false;
  }
}

export function extractListType(state: State): void {
  const argument = state.currentArgument;
  const method = state.currentMethod;

  if (method && argument) {
    // Argument value
    argument.array = createArrayDefinition({
      name: argument.name,
      type: "N/A",
      required: state.nonNullType,
    });
    state.currentArgument = argument.array;
    state.nonNullType = false;
  } else if (method) {
    // Return value
    if (!method.return) {
      method.return = createPropertyDefinition({
        type: "N/A",
        name: method.name,
      });
      state.currentReturn = method.return;
    } else if (!state.currentReturn) {
      state.currentReturn = method.return;
    }

    state.currentReturn.array = createArrayDefinition({
      type: "N/A",
      name: method.name,
      required: state.nonNullType,
    });
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

  const argument = createPropertyDefinition({
    type: "N/A",
    name: node.name.value,
  });
  method.arguments.push(argument);
  state.currentArgument = argument;
}
