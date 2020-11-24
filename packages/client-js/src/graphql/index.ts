import { ExecuteOptions } from "../web3api"

import {
  DocumentNode,
  GraphQLError
} from "graphql";
import gql from "graphql-tag";

export type QueryDocument = DocumentNode;

export type QueryResult<T> = {
  data: T;
  errors?: ReadonlyArray<GraphQLError>;
}

export function createQueryDocument(query: string): QueryDocument {
  return gql(query);
}

export function extractExecuteOptions(
  doc: QueryDocument,
  variables: Record<string, any>
): ExecuteOptions {
  // TODO:
  // - error on more than one operation
  // - 
}
