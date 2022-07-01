import { Abi } from "../abi";
import { getEnumTypesVisitor } from "./enum-types";
import { getObjectTypesVisitor } from "./object-types";
import { getModuleTypesVisitor } from "./module-types";
import { getImportedObjectTypesVisitor } from "./imported-object-types";
import { getImportedModuleTypesVisitor } from "./imported-module-types";
import { getImportedEnumTypesVisitor } from "./imported-enum-types";
import { getEnvVisitor } from "./env-types";
import { getImportedEnvTypesVisitor } from "./imported-env-types";

import { ASTVisitor } from "graphql";

export type SchemaExtractorBuilder = (abi: Abi) => ASTVisitor;

export const extractors: SchemaExtractorBuilder[] = [
  getEnumTypesVisitor,
  getImportedEnumTypesVisitor,
  getObjectTypesVisitor,
  getImportedObjectTypesVisitor,
  getModuleTypesVisitor,
  getImportedModuleTypesVisitor,
  getEnvVisitor,
  getImportedEnvTypesVisitor,
];
