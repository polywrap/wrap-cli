import { TypeInfo } from "../typeInfo";
import { getEnumTypesVisitor } from "./enum-types";
import { getObjectTypesVisitor } from "./object-types";
import { getmoduleTypesVisitor } from "./module-types";
import { getImportedObjectTypesVisitor } from "./imported-object-types";
import { getimportedModuleTypesVisitor } from "./imported-module-types";
import { getImportedEnumTypesVisitor } from "./imported-enum-types";
import { getUnionTypesVisitor } from "./union-types";
import { getImportedUnionTypesVisitor } from "./imported-union-types";
import { getEnvVisitor } from "./env-types";

import { ASTVisitor } from "graphql";

export type SchemaExtractorBuilder = (typeInfo: TypeInfo) => ASTVisitor;

export const extractors: SchemaExtractorBuilder[] = [
  getEnumTypesVisitor,
  getUnionTypesVisitor,
  getImportedEnumTypesVisitor,
  getObjectTypesVisitor,
  getImportedObjectTypesVisitor,
  getmoduleTypesVisitor,
  getimportedModuleTypesVisitor,
  getImportedUnionTypesVisitor,
  getEnvVisitor,
];
