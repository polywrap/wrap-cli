import { ASTNode, Visitor, ASTKindToNode } from "graphql";

type CatchAllVisitorFunction = (
  node: ASTNode,
  key: string | number | undefined,
  parent: ASTNode | undefined,
  path: ReadonlyArray<string | number>
) => void;

type VisitorFunction = (node: ASTNode) => void;

const buildVisitorMapsAndFuncs = (visitors: {
  enter?: Record<string, VisitorFunction> | CatchAllVisitorFunction,
  leave?: Record<string, VisitorFunction> | CatchAllVisitorFunction
}[]) => {
  const enterVisitorMap: Record<string, VisitorFunction[]> = {};
  const leaveVisitorMap: Record<string, VisitorFunction[]> = {};
  const enterFuncs: Array<CatchAllVisitorFunction> = [];
  const leaveFuncs: Array<CatchAllVisitorFunction> = [];

  for(const visitor of visitors) {
    if(visitor.enter) {
      if(typeof visitor.enter === "function") {
        enterFuncs.push(visitor.enter);
      } else {
        for(const nodeKind of Object.keys(visitor.enter)) {
          if(!enterVisitorMap[nodeKind]) {
            enterVisitorMap[nodeKind] = [];
          } 
  
          enterVisitorMap[nodeKind].push(visitor.enter[nodeKind]);
        }
      }
    }

    if(visitor.leave) {
      if(typeof visitor.leave === "function") {
        leaveFuncs.push(visitor.leave);
      } else {
        for(const nodeKind of Object.keys(visitor.leave)) {
          if(!leaveVisitorMap[nodeKind]) {
            leaveVisitorMap[nodeKind] = [];
          } 
  
          leaveVisitorMap[nodeKind].push(visitor.leave[nodeKind]);
        }
      }
    }
  }

  return {
    enterVisitorMap,
    leaveVisitorMap,
    enterFuncs,
    leaveFuncs
  };
};

const buildVisitors = (
  enterVisitorMap: Record<string, VisitorFunction[]>,
  leaveVisitorMap:Record<string, VisitorFunction[]>,
  enterFuncs: CatchAllVisitorFunction[] = [],
  leaveFuncs: CatchAllVisitorFunction[] = [] = []
) => {
  const enterVisitors: Record<string, VisitorFunction> = {};
  const leaveVisitors: Record<string, VisitorFunction> = {};

  for(const key of Object.keys(enterVisitorMap)) {
    enterVisitors[key] = (node) => {
      for(const visitorType of enterVisitorMap[key]) {
        visitorType(node);
      }
    };
  }

  for(const key of Object.keys(leaveVisitorMap)) {
    leaveVisitors[key] = (node) => {
      for(const visitorType of leaveVisitorMap[key]) {
        visitorType(node);
      }
    };
  }

  return {
    enterVisitor: (
      node: ASTNode,
      key: string | number | undefined,
      parent: ASTNode | undefined,
      path: ReadonlyArray<string | number>
    ) => {
      for(const enterFunc of enterFuncs) {
        enterFunc(node, key, parent, path);
      }

      const enterVisitor = enterVisitors[node.kind];
      
      if(enterVisitor) {
        enterVisitor(node);
      }
    },
    leaveVisitor: (
      node: ASTNode,
      key: string | number | undefined,
      parent: ASTNode | undefined,
      path: ReadonlyArray<string | number>
    ) => {
      for(const leaveFunc of leaveFuncs) {
        leaveFunc(node, key, parent, path);
      }

      const leaveVisitor = leaveVisitors[node.kind];
      
      if(leaveVisitor) {
        leaveVisitor(node);
      }
    }
  };
};

export const aggregateVisitors = (visitors: {
  enter?: Record<string, VisitorFunction> | CatchAllVisitorFunction,
  leave?: Record<string, VisitorFunction> | CatchAllVisitorFunction
}[]): Visitor<ASTKindToNode> => {

  const {
    enterVisitorMap,
    leaveVisitorMap,
    enterFuncs,
    leaveFuncs
  } = buildVisitorMapsAndFuncs(visitors);
 
  const { 
    enterVisitor, 
    leaveVisitor 
  } = buildVisitors(
    enterVisitorMap,
    leaveVisitorMap,
    enterFuncs,
    leaveFuncs
  );

  return {
    enter: enterVisitor,
    leave: leaveVisitor
  };
};