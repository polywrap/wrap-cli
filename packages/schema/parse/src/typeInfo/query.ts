export const moduleTypes = {
  Mutation: "Mutation",
  Query: "Query",
};

export type moduleTypes = typeof moduleTypes;

export type QueryType = keyof moduleTypes;

export function isQueryType(type: string): type is QueryType {
  return type in moduleTypes;
}

export const queryTypeNames = Object.keys(moduleTypes);
