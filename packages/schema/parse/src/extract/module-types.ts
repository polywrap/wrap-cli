import {
  TypeInfo,
  ModuleDefinition,
  createModuleDefinition,
  createMethodDefinition,
  createPropertyDefinition,
  createInterfaceImplementedDefinition,
  CapabilityType,
  InvokableModules,
  createCapability,
  createInterfaceDefinition,
  InterfaceDefinition,
  capabilityTypes,
} from "../typeInfo";
import {
  extractInputValueDefinition,
  extractListType,
  extractNamedType,
  State,
} from "./module-types-utils";

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

const visitorEnter = (moduleTypes: ModuleDefinition[], state: State) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    const nodeName = node.name.value;

    if (nodeName !== "Query" && nodeName !== "Mutation") {
      return;
    }

    const imports = parseImportsDirective(nodeName, node);

    const interfaces = parseCapabilitiesDirective(nodeName, node);
    state.currentInterfaces = interfaces;

    const module = createModuleDefinition({
      type: nodeName,
      imports,
      interfaces: node.interfaces?.map((x) =>
        createInterfaceImplementedDefinition({ type: x.name.value })
      ),
      comment: node.description?.value,
    });
    moduleTypes.push(module);
    state.currentModule = module;
  },
  FieldDefinition: (node: FieldDefinitionNode) => {
    const module = state.currentModule;

    if (!module) {
      return;
    }

    const returnType = createPropertyDefinition({
      type: "N/A",
      name: node.name.value,
    });

    const method = createMethodDefinition({
      type: module.type,
      name: node.name.value,
      return: returnType,
      comment: node.description?.value,
    });
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

const parseCapabilitiesDirective = (
  nodeName: string,
  node: ObjectTypeDefinitionNode
): InterfaceDefinition[] => {
  const interfaces: InterfaceDefinition[] = [];
  const interfacesByNamespace: Record<string, InterfaceDefinition> = {};

  if (!node.directives) {
    return interfaces;
  }

  for (const dir of node.directives) {
    if (dir.name.value !== "capability") {
      continue;
    }

    if (!dir.arguments) {
      throw Error(
        `@capability directive is incomplete, missing arguments. See type ${nodeName}.`
      );
    }

    const typeIndex = dir.arguments.findIndex(
      (arg: ArgumentNode) => arg.name.value === "type"
    );

    if (typeIndex === -1) {
      throw Error(
        `@capability directive missing required argument "type". See type ${nodeName}.`
      );
    }

    const typeArg = dir.arguments[typeIndex];

    if (typeArg.value.kind !== "StringValue") {
      throw Error(
        `@capability directive's "type" argument must be a String type. See type ${nodeName}.`
      );
    }

    if (!capabilityTypes.includes(typeArg.value.value as CapabilityType)) {
      throw Error(
        `@capability directive's "type" argument must be one from ${JSON.stringify(
          capabilityTypes
        )}. See type ${nodeName}.`
      );
    }

    const capabilityType = typeArg.value.value as CapabilityType;

    const uriIndex = dir.arguments.findIndex(
      (arg: ArgumentNode) => arg.name.value === "uri"
    );

    if (uriIndex === -1) {
      throw Error(
        `@capability directive missing required argument "uri". See type ${nodeName}.`
      );
    }

    const uriArg = dir.arguments[uriIndex];

    if (uriArg.value.kind !== "StringValue") {
      throw Error(
        `@capability directive's "uri" argument must be a String type. See type ${nodeName}.`
      );
    }

    const uri = uriArg.value.value;

    const namespaceIndex = dir.arguments.findIndex(
      (arg: ArgumentNode) => arg.name.value === "namespace"
    );

    if (namespaceIndex === -1) {
      throw Error(
        `@capability directive missing required argument "namespace". See type ${nodeName}.`
      );
    }

    const namespaceArg = dir.arguments[namespaceIndex];

    if (namespaceArg.value.kind !== "StringValue") {
      throw Error(
        `@capability directive's "namespace" argument must be a String type. See type ${nodeName}.`
      );
    }

    const namespace = namespaceArg.value.value;

    if (!interfacesByNamespace[namespace]) {
      interfacesByNamespace[namespace] = createInterfaceDefinition({
        type: namespace,
        uri: uri,
        namespace: namespace,
        capabilities: createCapability({
          type: capabilityType,
          enabled: true,
          modules: [node.name.value.toLowerCase() as InvokableModules],
        }),
      });
    } else {
      const interfaceType = interfacesByNamespace[namespace];
      if (
        interfaceType.capabilities[capabilityType] &&
        !interfaceType.capabilities[capabilityType].modules.includes(
          node.name.value.toLowerCase() as InvokableModules
        )
      ) {
        interfaceType.capabilities[capabilityType].modules.push(
          node.name.value.toLowerCase() as InvokableModules
        );
      }
    }
  }

  return Array.from(Object.values(interfacesByNamespace));
};

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

const visitorLeave = (typeInfo: TypeInfo, state: State) => ({
  ObjectTypeDefinition: (_node: ObjectTypeDefinitionNode) => {
    if (state.currentInterfaces) {
      typeInfo.interfaceTypes = [
        ...typeInfo.interfaceTypes,
        ...state.currentInterfaces,
      ];
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
    state.nonNullType = false;
  },
});

export const getmoduleTypesVisitor = (typeInfo: TypeInfo): ASTVisitor => {
  const state: State = {};

  return {
    enter: visitorEnter(typeInfo.moduleTypes, state),
    leave: visitorLeave(typeInfo, state),
  };
};
