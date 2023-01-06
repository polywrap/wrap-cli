import { ASTVisitor } from "graphql";
import { Abi } from "../definitions";

export interface VisitorBuilder {
  build(abi: Abi): ASTVisitor
}