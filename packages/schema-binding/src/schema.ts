import {
  GraphQLSchema as Schema,
  buildSchema as graphqlBuildSchema
} from "graphql";

export { Schema };

export function buildSchema(schema: string): Schema {
  return graphqlBuildSchema(schema);
}
