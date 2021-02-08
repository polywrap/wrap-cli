const operationTypes = {
  mutation: "mutation",
  query: "query",
};

export type OperationTypes = typeof operationTypes;

export type OperationType = keyof OperationTypes;

export function isOperationType(type: string): type is OperationType {
  return type in operationTypes;
}

export const operationTypeNames = Object.keys(operationTypes);
