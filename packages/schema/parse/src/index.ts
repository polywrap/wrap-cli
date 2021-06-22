import { TypeInfo, createTypeInfo } from "./typeInfo";
import { extractors, SchemaExtractor } from "./extract";
import { TypeInfoTransforms, transformTypeInfo } from "./transform";
import { finalizePropertyDef } from "./transform/finalizePropertyDef";
import { validators, SchemaValidator } from "./validate";
import { Blackboard } from "./extract/Blackboard";

import { ASTNode, DocumentNode, parse, visit } from "graphql";

export * from "./typeInfo";
export * from "./transform";
export * from "./header";

interface ParserOptions {
  extractors?: SchemaExtractor[];
  transforms?: TypeInfoTransforms[];
  validators?: SchemaValidator[];
  noValidate?: boolean;
}

export function parseSchema(
  schema: string,
  options: ParserOptions = {}
): TypeInfo {
  const astNode = parse(schema);

  // Validate GraphQL Schema
  if (!options.noValidate) {
    const validates = options.validators || validators;
    const errors: Error[] = [];

    for (const validate of validates) {
      try {
        validate(astNode);
      } catch (e) {
        errors.push(e);
      }
    }

    if (errors.length) {
      throw errors;
    }
  }

  // Create a blackboard for shared metadata
  const blackboard = new Blackboard(astNode);

  // Extract & Build TypeInfo
  let info = createTypeInfo();

  const extracts = options.extractors || extractors;
  extract(astNode, info, blackboard, extracts);

  // Finalize & Transform TypeInfo
  info = transformTypeInfo(info, finalizePropertyDef);

  if (options && options.transforms) {
    for (const transform of options.transforms) {
      info = transformTypeInfo(info, transform);
    }
  }

  return info;
}

const extract = (
  astNode: DocumentNode,
  typeInfo: TypeInfo,
  blackboard: Blackboard,
  extractors: SchemaExtractor[],
) => {
  const buildVisitorMaps = () => {
    const enterVisitorMap: Record<string, any> = {};
    const leaveVisitorMap: Record<string, any> = {};
  
    for(const visitor of aggregatedVisitors) {
      if(visitor.enter) {
        for(const type of Object.keys(visitor.enter)) {
          if(!enterVisitorMap[type]) {
            enterVisitorMap[type] = [];
          } 
  
          enterVisitorMap[type].push(visitor.enter[type]);
        }
      }
  
      if(visitor.leave) {
        for(const type of Object.keys(visitor.leave)) {
          if(!leaveVisitorMap[type]) {
            leaveVisitorMap[type] = [];
          } 
  
          leaveVisitorMap[type].push(visitor.leave[type]);
        }
      }
    }

    return {
      enterVisitorMap,
      leaveVisitorMap
    };
  };

  const buildVisitors = () => {
    const enterVisitor: Record<string, (node: ASTNode) => void> = {};
    const leaveVisitor: Record<string, (node: ASTNode) => void> = {};
  
    for(const key of Object.keys(enterVisitorMap)) {
      enterVisitor[key] = (node) => {
        for(const visitorType of enterVisitorMap[key]) {
          visitorType(node);
        }
      };
    }
  
    for(const key of Object.keys(leaveVisitorMap)) {
      leaveVisitor[key] = (node) => {
        for(const visitorType of leaveVisitorMap[key]) {
          visitorType(node);
        }
      };
    }

    return {
      enterVisitor,
      leaveVisitor
    };
  };
  
  var aggregatedVisitors = extractors.map(getVisitor => getVisitor(typeInfo, blackboard));

  const {
    enterVisitorMap,
    leaveVisitorMap
  } = buildVisitorMaps();
 
  const { 
    enterVisitor, 
    leaveVisitor 
  } = buildVisitors();

  visit(astNode, {
    enter: enterVisitor,
    leave: leaveVisitor
  });
};
