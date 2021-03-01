import * as directiveValidators from "./directives";
import * as typeValidators from "./types";

import { DocumentNode } from "graphql";

export type SchemaValidator = (astNode: DocumentNode) => void;

export const validators: SchemaValidator[] = [
  directiveValidators.supportedDirectives,
  directiveValidators.importedDirective,
  directiveValidators.importsDirective,
  typeValidators.typeDefinitions,
  typeValidators.propertyTypes,
  typeValidators.infiniteRecursions,
];

export { directiveValidators, typeValidators };
