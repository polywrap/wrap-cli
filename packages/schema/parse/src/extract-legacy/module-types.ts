import {
  createModuleDefinition,
  createMethodDefinition,
  createPropertyDefinition,
  createInterfaceImplementedDefinition,
  CapabilityType,
  createCapability,
  createInterfaceDefinition,
  capabilityTypes,
} from "..";
import {
  extractEnvDirective,
  extractInputValueDefinition,
  extractListType,
  extractNamedType,
  State,
} from "./utils/module-types-utils";

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
import {
  InterfaceDefinition,
  MapDefinition,
  WrapAbi,
} from "@polywrap/wrap-manifest-types-js";

const visitorEnter = (abi: WrapAbi, state: State) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    const nodeName = node.name.value;

    if (nodeName !== "Module") {
      return;
    }

    const imports = parseImportsDirective(nodeName, node);

    const enabledInterfaces = parseCapabilitiesDirective(nodeName, node);
    state.currentInterfaces = enabledInterfaces;

    const interfaces = node.interfaces?.map((x) =>
      createInterfaceImplementedDefinition({ type: x.name.value })
    );

    const module = createModuleDefinition({
      imports: imports.length ? imports : undefined,
      interfaces: interfaces?.length ? interfaces : undefined,
      comment: node.description?.value,
    });

    abi.moduleType = module;
    state.currentModule = module;
  },
  FieldDefinition: (node: FieldDefinitionNode) => {
    const module = state.currentModule;

    if (!module) {
      return;
    }

    const name = node.name.value;

    const { type, def } = extractAnnotateDirective(node, name);

    const returnType = createPropertyDefinition({
      type: type ? type : "N/A",
      name: node.name.value,
      map: def
        ? ({ ...def, name: node.name.value } as MapDefinition)
        : undefined,
      required: def && def.required,
    });

    const method = createMethodDefinition({
      name: node.name.value,
      return: returnType,
      comment: node.description?.value,
    });

    const envDirDefinition = extractEnvDirective(node);

    if (envDirDefinition) {
      method.env = envDirDefinition;
    }

    if (!module.methods) {
      module.methods = [];
    }

    module.methods.push(method);
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
        `@imports directive's "types" argument must be a List type. See type ${nodeName}.`
      );
    }

    const listValue = typesArg.value;

    listValue.values.forEach((value: ValueNode) => {
      if (value.kind !== "StringValue") {
        throw Error(
          `@imports directive's "types" list must only contain strings. See type ${nodeName}.`
        );
      }

      imports.push({ type: value.value });
    });
  }

  return imports;
};

const visitorLeave = (abi: WrapAbi, state: State) => ({
  ObjectTypeDefinition: (_node: ObjectTypeDefinitionNode) => {
    if (!abi.interfaceTypes) {
      abi.interfaceTypes = [];
    }
    if (state.currentInterfaces) {
      abi.interfaceTypes = [...abi.interfaceTypes, ...state.currentInterfaces];
    }

    state.currentInterfaces = undefined;
    state.currentModule = undefined;
  },
  FieldDefinition: (_node: FieldDefinitionNode) => {
    state.currentMethod = undefined;
    state.currentReturn = undefined;
  },
  InputValueDefinition: (_node: InputValueDefinitionNode) => {
    state.currentArgument = undefined;
  },
  NonNullType: (_node: NonNullTypeNode) => {
    state.nonNullType = undefined;
  },
});

export const getModuleTypesVisitor = (abi: WrapAbi): ASTVisitor => {
  const state: State = {};

  return {
    enter: visitorEnter(abi, state),
    leave: visitorLeave(abi, state),
  };
};
