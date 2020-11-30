import { Web3ApiClient } from "./";

export type Resolver = (
  input: Record<string, any>,
  client: Web3ApiClient
) => Promise<Record<string, any>>;

export interface Resolvers {
  Query: Record<string, Resolver>;
  Mutation: Record<string, Resolver>;
}

export abstract class Web3ApiClientPlugin {
  abstract getResolvers(): Resolvers;
}
