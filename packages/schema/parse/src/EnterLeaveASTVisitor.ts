import { ASTKindToNode } from "graphql";
import { EnterLeave, VisitFn } from "graphql/language/visitor";

//Helper type to avoid supporting the full ASTVisitor from graphql 
//which can also be of type ShapeMapVisitor<KindToNode, Nodes>
//To fully support ASTVisitor, the aggregateVisitor function should be 
//expanded to support ShapeMapVisitor<KindToNode, Nodes>
export type EnterLeaveASTVisitor = EnterLeave<
  VisitFn<ASTKindToNode[keyof ASTKindToNode]> | 
  { [K in keyof ASTKindToNode]?: VisitFn<ASTKindToNode[keyof ASTKindToNode], ASTKindToNode[K]> }
>;