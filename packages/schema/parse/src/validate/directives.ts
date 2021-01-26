import { visit, DocumentNode, DirectiveNode, StringValueNode } from "graphql";

type ImportsArguments = string[];
type ImportedArguments = { namespace: string; uri: string; type: string };

const validateImportsUsage = (astNode: DocumentNode) => {
  const badUsageLocations: string[] = [];

  visit(astNode, {
    ObjectTypeDefinition: (node) => {
      const importsAllowedObjectTypes = ["Query", "Mutation"];
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
    },
  });

  if (badUsageLocations.length) {
    throw new Error(
      `@imports directive should only be used on QUERY or MUTATION type definitions, but it is being used on the following ObjectTypeDefinitions: ${badUsageLocations.map(
        (b) => `\n-${b}`
      )}`
    );
  }
};

const validateAndExtractImportsArguments = (
  node: DirectiveNode
): ImportsArguments => {
  const args = node.arguments || [];
  const types = args.find((arg) => arg.name.value === "types");

  if (!types) {
    throw new Error(
      "@imports directive requires argument 'types' of type [String!]! but it was not provided"
    );
  }

  if (types.value.kind === "ListValue") {
    const values = types.value.values;

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

    return values.map((value: StringValueNode) => value.value);
  } else {
    throw new Error(`@imports directive's 'types' must be of type [String!]!`);
  }
};

const validateAndExtractImportedArguments = (
  node: DirectiveNode
): ImportedArguments => {
  const args = node.arguments || [];
  const expectedArguments = ["namespace", "uri", "type"] as const;

  return expectedArguments.reduce(
    (prev, expectedArg) => {
      const foundArgument = args.find((arg) => arg.name.value === expectedArg);

      if (!foundArgument) {
        throw new Error(
          `@imported directive's '${foundArgument}' argument is required but was not provided`
        );
      }

      if (foundArgument.value.kind !== "StringValue") {
        throw new Error(
          `@imported directive's '${foundArgument.name.value}' should be of type String but found ${foundArgument.value.kind}`
        );
      }

      return { ...prev, [expectedArg]: foundArgument.value.value };
    },
    { namespace: "", uri: "", type: "" }
  );
};

export const directives = {
  imports: {
    validate: validateImportsUsage,
    arguments: validateAndExtractImportsArguments,
  },
  imported: {
    validate: () => {},
    arguments: validateAndExtractImportedArguments,
  },
};

export const validateDirectives = (astNode: DocumentNode) => {
  visit(astNode, {
    enter: {
      Directive: (node) => {
        directives[node.name.value as keyof typeof directives].validate(
          astNode
        );
        directives[node.name.value as keyof typeof directives].arguments(node);
      },
    },
  });
}
