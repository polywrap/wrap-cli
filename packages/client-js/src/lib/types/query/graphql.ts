import { DocumentNode } from "graphql/language";
import { ExecutionResult } from "graphql/execution";

export interface GqlQuery {
  query: DocumentNode
  variables?: Record<string, any>
}

export type GqlQueryResult = ExecutionResult
