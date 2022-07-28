import { createPropertyDefinition, createArrayDefinition } from "../../abi";
import { setPropertyType } from "./property-utils";
import { extractAnnotateDirective } from "./object-types-utils";

import {
  BooleanValueNode,
  FieldDefinitionNode,
  InputValueDefinitionNode,
  NamedTypeNode,
} from "graphql";
import {
  ImportedModuleDefinition,
  InterfaceDefinition,
  MapDefinition,
  MethodDefinition,
  ModuleDefinition,
  PropertyDefinition,
} from "@polywrap/wrap-manifest-types-js";

export interface EnvDirDefinition {
  required: boolean;
}

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

    if (state.currentReturn) {
      setPropertyType(state.currentReturn, method.name, {
        type: node.name.value,
        required: state.nonNullType,
      });
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

  const name = node.name.value;
  const { type, def } = extractAnnotateDirective(node, name);

  const argument = createPropertyDefinition({
    type: type ? type : "N/A",
    name: name,
    map: def ? (def as MapDefinition) : undefined,
    comment: node.description?.value,
    required: !!(def && def.required),
  });

  if (!method.arguments) {
    method.arguments = [];
  }
  method.arguments.push(argument);
  state.currentArgument = argument;
}

export function extractEnvDirective(
  node: FieldDefinitionNode
): EnvDirDefinition | undefined {
  if (node.directives) {
    for (const dir of node.directives) {
      if (dir.name.value === "env") {
        const required = (dir.arguments?.find(
          (arg) => arg.name.value === "required"
        )?.value as BooleanValueNode).value;
        if (required === undefined) {
          throw new Error(
            `Env directive: ${node.name.value} has invalid arguments`
          );
        }
        return {
          required,
        };
      }
    }
  }

  return undefined;
}
