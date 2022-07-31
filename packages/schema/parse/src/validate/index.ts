import * as directiveValidators from "./directives";
import * as typeValidators from "./types";

import { ASTVisitor, DocumentNode } from "graphql";

export type SchemaValidator = {
  visitor: ASTVisitor;
  cleanup?: (documentNode: DocumentNode) => void;
};

export type SchemaValidatorBuilder = () => SchemaValidator;

export const validators: SchemaValidatorBuilder[] = [
  ...Object.values(directiveValidators).filter((x) => typeof x === "function"),
  ...Object.values(typeValidators).filter((x) => typeof x === "function"),
];

export { directiveValidators, typeValidators };
