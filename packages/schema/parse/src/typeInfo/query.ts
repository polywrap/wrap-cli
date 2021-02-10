const queryTypes = {
  Mutation: "Mutation",
  Query: "Query",
};

export type QueryTypes = typeof queryTypes;

export type QueryType = keyof QueryTypes;

export function isQueryType(type: string): type is QueryType {
  return type in queryTypes;
}

export const queryTypeNames = Object.keys(queryTypes);
