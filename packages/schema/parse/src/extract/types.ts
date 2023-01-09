import { ASTVisitor } from "graphql";
import { Abi, UniqueDefKind } from "../definitions";

export interface VisitorBuilder {
  build(abi: Abi): ASTVisitor
}

export type ExternalVisitorBuilder = (abi: Abi, uniqueDefs?: Map<string, UniqueDefKind>) => ASTVisitor