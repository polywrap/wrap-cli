import {
  ImportedDefinition,
  isImportedEnvType,
  isImportedModuleType,
} from "../../abi";

import { DirectiveNode, TypeDefinitionNode } from "graphql";

export function extractImportedDefinition(
  node: TypeDefinitionNode,
  type?: "module" | "env"
): ImportedDefinition | undefined {
  if (!node.directives) {
    return undefined;
  }

  // Look for the imported directive
  const importedIndex = node.directives.findIndex(
    (dir: DirectiveNode) => dir.name.value === "imported"
  );

  if (importedIndex === -1) {
    return undefined;
  }

  const typeName = node.name.value;

  if (
    (type === "module" && !isImportedModuleType(typeName)) ||
    (type !== "module" && isImportedModuleType(typeName)) ||
    (type === "env" && !isImportedEnvType(typeName)) ||
    (type !== "env" && isImportedEnvType(typeName))
  ) {
    return undefined;
  }

  const importedDir = node.directives[importedIndex];

  const args = importedDir.arguments || [];
  const result: ImportedDefinition = {
    namespace: "",
    nativeType: "",
    uri: "",
  };

  Object.keys(result).map((key: keyof typeof result) => {
    const argumentNode = args.find((arg) => arg.name.value === key);

    if (argumentNode && argumentNode.value.kind === "StringValue") {
      result[key] = argumentNode.value.value;
    }
  });

  return result;
}
