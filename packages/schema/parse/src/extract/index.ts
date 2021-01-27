import { TypeInfo } from "../typeInfo";
import { extractObjectTypes } from "./object-types";
import { extractQueryTypes } from "./query-types";
import { extractImportedObjectTypes } from "./imported-object-types";
import { extractImportedQueryTypes } from "./imported-query-types";

import { DocumentNode } from "graphql";

export type SchemaExtractor = (
  astNode: DocumentNode,
  typeInfo: TypeInfo
) => void;

export const extractors: SchemaExtractor[] = [
  extractObjectTypes,
  extractImportedObjectTypes,
  extractQueryTypes,
  extractImportedQueryTypes,
];
