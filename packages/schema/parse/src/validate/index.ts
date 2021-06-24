import { ASTVisitor, DocumentNode } from "graphql";
import * as directiveValidators from "./directives";
import * as typeValidators from "./types";

export type SchemaValidator = () => {
  visitor: ASTVisitor,
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
