import { TypeInfo } from "../typeInfo";
import { getEnumTypesVisitor } from "./enum-types";
import { getObjectTypesVisitor } from "./object-types";
import { getQueryTypesVisitor } from "./query-types";
import { getImportedObjectTypesVisitor } from "./imported-object-types";
import { getImportedQueryTypesVisitor } from "./imported-query-types";
import { getImportedEnumTypesVisitor } from "./imported-enum-types";
import { Blackboard } from "./Blackboard";
import { ASTNode } from "graphql";

export type SchemaExtractor = (
  typeInfo: TypeInfo,
  blackboard: Blackboard
) => {
  enter?: Record<string, (node: ASTNode) => void>;
  leave?: Record<string, (node: ASTNode) => void>;
};

export const extractors: SchemaExtractor[] = [
  getEnumTypesVisitor,
  getImportedEnumTypesVisitor,
  getObjectTypesVisitor,
  getImportedObjectTypesVisitor,
  getQueryTypesVisitor,
  getImportedQueryTypesVisitor,
];
