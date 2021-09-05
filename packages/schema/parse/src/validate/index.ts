import * as directiveValidators from "./directives";
import * as typeValidators from "./types";

import { ASTVisitor, DocumentNode } from "graphql";

export type SchemaValidator = {
  visitor: ASTVisitor;
  displayValidationMessagesIfExist?: (documentNode: DocumentNode) => void;
};

export type SchemaValidatorBuilder = () => SchemaValidator;

export const validators: SchemaValidatorBuilder[] = [
  directiveValidators.getSupportedDirectivesValidator,
  directiveValidators.getImportedDirectiveValidator,
  directiveValidators.getImportsDirectiveValidator,
  typeValidators.getTypeDefinitionsValidator,
  typeValidators.getPropertyTypesValidator,
  typeValidators.getCircularDefinitionsValidator,
];

export { directiveValidators, typeValidators };
