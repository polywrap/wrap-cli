import { TypeInfo } from "../typeInfo";
import { getEnumTypesVisitor } from "./enum-types";
import { getObjectTypesVisitor } from "./object-types";
import { getQueryTypesVisitor } from "./query-types";
import { getImportedObjectTypesVisitor } from "./imported-object-types";
import { getImportedQueryTypesVisitor } from "./imported-query-types";
import { getImportedEnumTypesVisitor } from "./imported-enum-types";
import { getUnionTypesVisitor } from "./union-types";
import { getImportedUnionTypesVisitor } from "./imported-union-types";

import { ASTVisitor } from "graphql";

export type SchemaExtractorBuilder = (typeInfo: TypeInfo) => ASTVisitor;

export const extractors: SchemaExtractorBuilder[] = [
  getEnumTypesVisitor,
  getUnionTypesVisitor,
  getImportedEnumTypesVisitor,
  getObjectTypesVisitor,
  getImportedObjectTypesVisitor,
  getQueryTypesVisitor,
  getImportedQueryTypesVisitor,
  getImportedUnionTypesVisitor,
];
