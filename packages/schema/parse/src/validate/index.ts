import { DocumentNode } from "graphql";
import * as directiveValidators from "./directives";
import * as typeValidators from "./types";

export type SchemaValidator = () => {
  visitor: {
    enter?: Record<string, any>,
    leave?: Record<string, any>
  },
  displayValidationMessagesIfExist?: (documentNode: DocumentNode) => void
};

export const validators: SchemaValidator[] = [
  directiveValidators.getSupportedDirectivesValidator,
  directiveValidators.getImportedDirectiveValidator,
  directiveValidators.getImportsDirectiveValidator,
  typeValidators.getTypeDefinitionsValidator,
  typeValidators.getPropertyTypesValidator,
  typeValidators.getCircularDefinitionsValidator,
];

export { directiveValidators, typeValidators };
