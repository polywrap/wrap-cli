interface SupportedOperations {
  mutation: "mutation";
  query: "query";
}

const testInstance: SupportedOperations = {
  mutation: "mutation",
  query: "query",
};

export type OperationType = keyof SupportedOperations;

export function isOperationType(type: string): type is OperationType {
  return type in testInstance;
}
