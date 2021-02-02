import * as directiveValidators from "./directives";

import { DocumentNode } from "graphql";

export type SchemaValidator = (astNode: DocumentNode) => void;

export const validators: SchemaValidator[] = [
  directiveValidators.supportedDirectives,
  directiveValidators.importedDirective,
  directiveValidators.importsDirective,
];

export {
  directiveValidators
};
