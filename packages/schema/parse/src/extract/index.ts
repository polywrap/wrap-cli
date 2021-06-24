import { TypeInfo } from "../typeInfo";
import { getEnumTypesVisitor } from "./enum-types";
import { getObjectTypesVisitor } from "./object-types";
import { getQueryTypesVisitor } from "./query-types";
import { getImportedObjectTypesVisitor } from "./imported-object-types";
import { getImportedQueryTypesVisitor } from "./imported-query-types";
import { getImportedEnumTypesVisitor } from "./imported-enum-types";
import { Blackboard } from "./Blackboard";

import { ASTVisitor } from "graphql";

export type SchemaExtractor = (
  typeInfo: TypeInfo,
  blackboard: Blackboard
) => ASTVisitor;

export const extractors: SchemaExtractor[] = [
  getEnumTypesVisitor,
  getImportedEnumTypesVisitor,
  getObjectTypesVisitor,
  getImportedObjectTypesVisitor,
  getQueryTypesVisitor,
  getImportedQueryTypesVisitor,
];
