import { TypeInfo } from "../typeInfo";
import { extractEnumTypes } from "./enum-types";
import { extractObjectTypes } from "./object-types";
import { extractQueryTypes } from "./query-types";
import { extractImportedObjectTypes } from "./imported-object-types";
import { extractImportedQueryTypes } from "./imported-query-types";
import { extractImportedEnumTypes } from "./imported-enum-types";
import { Blackboard } from "./Blackboard";

import { DocumentNode } from "graphql";

export type SchemaExtractor = (
  astNode: DocumentNode,
  typeInfo: TypeInfo,
  blackboard: Blackboard
) => void;

export const extractors: SchemaExtractor[] = [
  extractEnumTypes,
  extractImportedEnumTypes,
  extractObjectTypes,
  extractImportedObjectTypes,
  extractQueryTypes,
  extractImportedQueryTypes,
];
