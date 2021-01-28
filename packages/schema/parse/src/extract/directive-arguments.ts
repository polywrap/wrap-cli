import { DirectiveNode } from "graphql";

interface ImportsArgs {
  types: string[];
}

export const extractImportsDirectiveArgs = (
  node: DirectiveNode
): ImportsArgs => {
  const args = node.arguments || [];
  const typesArgument = args.find((arg) => arg.name.value === "types");
  const result: ImportsArgs = {
    types: [],
  };

  if (typesArgument && typesArgument.value.kind === "ListValue") {
    typesArgument.value.values.forEach((value) => {
      if (value.kind === "StringValue") {
        result.types.push(value.value);
      }
    });
  }

  return result;
};

interface ImportedArgs {
  namespace: string;
  uri: string;
  type: string;
}

export const extractImportedDirectiveArgs = (
  node: DirectiveNode
): ImportedArgs => {
  const args = node.arguments || [];
  const result: ImportedArgs = {
    namespace: "",
    type: "",
    uri: "",
  };

  Object.keys(result).map((key: keyof typeof result) => {
    const argumentNode = args.find((arg) => arg.name.value === key);

    if (argumentNode && argumentNode.value.kind === "StringValue") {
      result[key] = argumentNode.value.value;
    }
  });

  return result;
};
