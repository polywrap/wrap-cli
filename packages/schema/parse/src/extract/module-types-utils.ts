import {
  PropertyDefinition,
  ImportedModuleDefinition,
  MethodDefinition,
  createPropertyDefinition,
  ModuleDefinition,
  createArrayDefinition,
  InterfaceDefinition,
} from "../typeInfo";
import { setPropertyType } from "./property-utils";

import { InputValueDefinitionNode, NamedTypeNode } from "graphql";

export interface State {
  currentModule?: ModuleDefinition;
  currentMethod?: MethodDefinition;
  currentArgument?: PropertyDefinition;
  currentReturn?: PropertyDefinition;
  nonNullType?: boolean;
  currentInterfaces?: InterfaceDefinition[];
  currentImport?: ImportedModuleDefinition;
}

export function extractNamedType(node: NamedTypeNode, state: State): void {
  const argument = state.currentArgument;
  const method = state.currentMethod;

  if (method && argument) {
    if (!argument.name) {
      throw Error(
        "extractNamedType: Invalid state. Uninitialized currentArgument, name not found.\n" +
          `Argument: ${JSON.stringify(
            argument,
            null,
            2
          )}\nState: ${JSON.stringify(state, null, 2)}`
      );
    }

    // Argument value
    setPropertyType(argument, argument.name, {
      type: node.name.value,
      required: state.nonNullType,
    });

    state.nonNullType = false;
  } else if (method) {
    // Return value
    if (!state.currentReturn) {
      state.currentReturn = method.return;
    }

    if (!method.name) {
      throw Error(
        "extractNamedType: Invalid state. Uninitialized currentMethod, name not found.\n" +
          `Method: ${JSON.stringify(method, null, 2)}\nState: ${JSON.stringify(
            state,
            null,
            2
          )}`
      );
    }

    setPropertyType(state.currentReturn, method.name, {
      type: node.name.value,
      required: state.nonNullType,
    });

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
    comment: node.description?.value,
  });
  method.arguments.push(argument);
  state.currentArgument = argument;
}
