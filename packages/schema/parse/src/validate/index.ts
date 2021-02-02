import * as directiveValidators from "./directives";
import * as typesValidators from "./types";

import { DocumentNode } from "graphql";

export type SchemaValidator = (astNode: DocumentNode) => void;

export const validators: SchemaValidator[] = [
  directiveValidators.supportedDirectives,
  directiveValidators.importedDirective,
  directiveValidators.importsDirective,
  typesValidators.validateTypes,
];

export { directiveValidators, typesValidators };
