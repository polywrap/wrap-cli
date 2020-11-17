import { DocumentNode } from "graphql/language";
import { ExecutionResult } from "graphql/execution";

export interface GqlQuery {
  uri: string;
  query: DocumentNode
  variables?: Record<string, any>
}

export type GqlQueryResult = ExecutionResult
