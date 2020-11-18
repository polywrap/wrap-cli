import { GqlQuery, GqlQueryResult } from ".";

/**
 * Generic interface of a Web3API.
 * All Web3API's whether they be WASM or JS must conform to this.
 */
export interface Web3API {
  query(query: GqlQuery): Promise<GqlQueryResult>;
}

/**
 * Represents the definition of a Web3API and allows for an instance of it to be created.
 */
export interface Web3APIDefinition {
  create: (client: Client) => Promise<Web3API>;
}
