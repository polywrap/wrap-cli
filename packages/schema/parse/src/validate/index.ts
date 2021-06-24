import * as directiveValidators from "./directives";
import * as typeValidators from "./types";
import { SchemaValidator } from "./SchemaValidator";

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
