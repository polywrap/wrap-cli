import { ASTVisitor, DocumentNode } from "graphql";

export type SchemaValidator = {
  visitor: ASTVisitor;
  displayValidationMessagesIfExist?: (documentNode: DocumentNode) => void;
};
