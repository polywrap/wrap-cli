import { SchemaValidator } from ".";
import { isImportedModuleType, isModuleType } from "..";

import { DirectiveNode, ASTNode, ObjectTypeDefinitionNode } from "graphql";
import { ImportedDefinition } from "@polywrap/wrap-manifest-types-js";

export const getSupportedDirectivesValidator = (): SchemaValidator => {
  const supportedDirectives = [
    "imported",
    "imports",
    "capability",
    "enabled_interface",
    "annotate",
    "env",
  ];
  const unsupportedUsages: string[] = [];

  return {
    visitor: {
      enter: {
        Directive: (node: DirectiveNode) => {
          const name = node.name.value;

          if (!supportedDirectives.includes(name)) {
            unsupportedUsages.push(name);
          }
        },
      },
    },
    cleanup: () => {
      if (unsupportedUsages.length) {
        throw new Error(
          `Found the following usages of unsupported directives:${unsupportedUsages.map(
            (u) => `\n@${u}`
          )}`
        );
      }
    },
  };
};

export const getEnvDirectiveValidator = (): SchemaValidator => {
  let currentType: string | undefined;

  return {
    visitor: {
      enter: {
        ObjectTypeDefinition: (node) => {
          currentType = node.name.value;
        },
        FieldDefinition: (node) => {
          const envDirective = node.directives?.find(
            (d) => d.name.value === "env"
          );

          if (
            envDirective &&
            currentType &&
            !isModuleType(currentType) &&
            !isImportedModuleType(currentType)
          ) {
            throw new Error(
              `@env directive should only be used on Module method definitions. Found on field '${node.name.value}' of type '${currentType}'`
            );
          }
        },
      },
      leave: {
        ObjectTypeDefinition: () => {
          currentType = undefined;
        },
      },
    },
  };
};

export const getImportsDirectiveValidator = (): SchemaValidator => {
  let isInsideObjectTypeDefinition = false;

  const ObjectTypeDefinition = (node: ObjectTypeDefinitionNode) => {
    isInsideObjectTypeDefinition = true;
    const badUsageLocations: string[] = [];

    const importsAllowedObjectTypes = ["Module"];
    const directives =
      node.directives &&
      node.directives.map((directive) => directive.name.value);

    if (
      directives &&
      directives.includes("imports") &&
      !importsAllowedObjectTypes.includes(node.name.value)
    ) {
      badUsageLocations.push(node.name.value);
    }

    if (badUsageLocations.length) {
      throw new Error(
        `@imports directive should only be used on Module type definitions, ` +
          `but it is being used on the following ObjectTypeDefinitions:${badUsageLocations.map(
            (b) => `\n${b}`
          )}`
      );
    }
  };

  const Directive = (
    node: DirectiveNode,
    key: string | number | undefined,
    parent: ASTNode | undefined,
    path: ReadonlyArray<string | number>
  ) => {
    if (node.name.value !== "imports") {
      return;
    }

    if (!isInsideObjectTypeDefinition) {
      throw new Error(
        `@imports directive should only be used on Module type definitions, ` +
          `but it is being used in the following location: ${path.join(" -> ")}`
      );
    }

    const args = node.arguments || [];
    const typesArgument = args.find((arg) => arg.name.value === "types");

    if (!args.length || !typesArgument) {
      throw new Error(
        `@imports directive requires argument 'types' of type [String!]!`
      );
    }

    if (args.length > 1) {
      throw new Error(
        `@imports directive takes only one argument 'types', but found: ${args
          .filter((arg) => arg.name.value !== "types")
          .map((arg) => `\n- ${arg.name.value}`)}`
      );
    }

    if (typesArgument.value.kind === "ListValue") {
      const values = typesArgument.value.values;

      if (!values.length) {
        throw new Error(
          `@imports directive's 'types' argument of type [String!]! requires at least one value`
        );
      }

      const nonStringValues = values.filter(
        (value) => value.kind !== "StringValue"
      );

      if (nonStringValues.length) {
        throw new Error(
          `@imports directive's 'types' List values must be of type String, but found: \n${nonStringValues.map(
            (nonStringValue) => `\n -${nonStringValue.kind}`
          )}`
        );
      }
    }
  };

  return {
    visitor: {
      enter: (
        node: ASTNode,
        key: string | number | undefined,
        parent: ASTNode | undefined,
        path: ReadonlyArray<string | number>
      ) => {
        if (node.kind === "ObjectTypeDefinition") {
          ObjectTypeDefinition(node as ObjectTypeDefinitionNode);
        } else if (node.kind === "Directive") {
          Directive(node as DirectiveNode, key, parent, path);
        } else if (
          node.kind !== "NamedType" &&
          node.kind !== "Name" &&
          node.kind !== "StringValue"
        ) {
          isInsideObjectTypeDefinition = false;
        }
      },
    },
  };
};

export const getImportedDirectiveValidator = (): SchemaValidator => {
  let isInsideObjectOrEnumTypeDefinition = false;

  const Directive = (
    node: DirectiveNode,
    key: string | number | undefined,
    parent: ASTNode | undefined,
    path: ReadonlyArray<string | number>
  ) => {
    if (node.name.value !== "imported") {
      return;
    }

    if (!isInsideObjectOrEnumTypeDefinition) {
      throw new Error(
        `@imported directive should only be used on object or enum type definitions, ` +
          `but it is being used in the following location: ${path.join(" -> ")}`
      );
    }

    const imported: ImportedDefinition = {
      uri: "",
      namespace: "",
      nativeType: "",
    };

    const args = node.arguments || [];
    const expectedArguments = Object.keys(imported);
    const actualArguments = args.map((arg) => arg.name.value);

    const missingArguments = expectedArguments.filter(
      (expected) => !actualArguments.includes(expected)
    );

    if (missingArguments.length) {
      throw new Error(
        `@imported directive is missing the following arguments:${missingArguments.map(
          (arg) => `\n- ${arg}`
        )}`
      );
    }

    const extraArguments = actualArguments.filter(
      (actual) => !expectedArguments.includes(actual)
    );

    if (extraArguments.length) {
      throw new Error(
        `@imported directive takes only 3 arguments: ${expectedArguments.join(
          ", "
        )}. But found:${extraArguments.map((arg) => `\n- ${arg}`)}`
      );
    }
  };

  return {
    visitor: {
      enter: (
        node: ASTNode,
        key: string | number | undefined,
        parent: ASTNode | undefined,
        path: ReadonlyArray<string | number>
      ) => {
        if (node.kind === "Directive") {
          Directive(node as DirectiveNode, key, parent, path);
        } else if (
          node.kind === "ObjectTypeDefinition" ||
          node.kind === "EnumTypeDefinition"
        ) {
          isInsideObjectOrEnumTypeDefinition = true;
        } else if (
          node.kind !== "NamedType" &&
          node.kind !== "Name" &&
          node.kind !== "StringValue"
        ) {
          isInsideObjectOrEnumTypeDefinition = false;
        }
      },
    },
  };
};
