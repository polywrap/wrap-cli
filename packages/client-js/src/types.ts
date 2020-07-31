import { DocumentNode } from "graphql/language";
import { ExecutionResult } from "graphql/execution";

export interface Query {
  query: DocumentNode
  variables?: Record<string, any>
}

export type QueryResult = ExecutionResult
