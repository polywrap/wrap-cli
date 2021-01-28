import {
  importedDirective,
  importsDirective,
  supportedDirectives,
} from "../validate/supported-directives";

import { DocumentNode } from "graphql";

export type SchemaValidator = (astNode: DocumentNode) => void;

export const validators: SchemaValidator[] = [
  supportedDirectives,
  importsDirective,
  importedDirective,
];
