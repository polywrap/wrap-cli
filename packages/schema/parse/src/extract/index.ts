import { TypeInfo } from "../typeInfo";
import { getEnumTypesVisitor } from "./enum-types";
import { getObjectTypesVisitor } from "./object-types";
import { getmoduleTypesVisitor } from "./query-types";
import { getImportedObjectTypesVisitor } from "./imported-object-types";
import { getimportedModuleTypesVisitor } from "./imported-query-types";
import { getImportedEnumTypesVisitor } from "./imported-enum-types";
import { getEnvVisitor } from "./env-types";

import { ASTVisitor } from "graphql";

export type SchemaExtractorBuilder = (typeInfo: TypeInfo) => ASTVisitor;

export const extractors: SchemaExtractorBuilder[] = [
  getEnumTypesVisitor,
  getImportedEnumTypesVisitor,
  getObjectTypesVisitor,
  getImportedObjectTypesVisitor,
  getmoduleTypesVisitor,
  getimportedModuleTypesVisitor,
  getEnvVisitor,
];
