interface SupportedQueries {
  Mutation: "Mutation";
  Query: "Query";
}

const testInstance: SupportedQueries = {
  Mutation: "Mutation",
  Query: "Query",
};

export type QueryType = keyof SupportedQueries;

export function isQueryType(type: string): type is QueryType {
  return type in testInstance;
}
