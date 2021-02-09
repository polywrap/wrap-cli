import {
  PropertyDefinition,
  ImportedQueryDefinition,
  MethodDefinition,
  createPropertyDefinition,
  QueryDefinition,
  createArrayDefinition,
} from "../typeInfo";
import { TypeDefinitions } from "./type-definitions";
import { setPropertyType } from "./utils";

import { InputValueDefinitionNode, NamedTypeNode } from "graphql";

export interface State {
  currentQuery?: QueryDefinition;
  currentMethod?: MethodDefinition;
  currentArgument?: PropertyDefinition;
  currentReturn?: PropertyDefinition;
  nonNullType?: boolean;
  currentImport?: ImportedQueryDefinition;
}

export function extractNamedType(
  node: NamedTypeNode,
  state: State,
  typeDefinitions: TypeDefinitions
): void {
  const argument = state.currentArgument;
  const method = state.currentMethod;

  if (method && argument) {
    // Argument value
    setPropertyType(
      argument,
      argument.name as string,
      {
        type: node.name.value,
        required: state.nonNullType,
      },
      typeDefinitions
    );

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

    setPropertyType(
      state.currentReturn,
      method.name as string,
      {
        type: node.name.value,
        required: state.nonNullType,
      },
      typeDefinitions
    );

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
