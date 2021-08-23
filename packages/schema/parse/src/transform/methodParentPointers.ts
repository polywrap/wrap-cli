import { TypeInfoTransforms } from ".";
import {
  QueryDefinition,
  ImportedQueryDefinition,
  MethodDefinition,
} from "../typeInfo";

export function methodParentPointers(): TypeInfoTransforms {
  const visitorStack: (QueryDefinition | ImportedQueryDefinition)[] = [];

  return {
    enter: {
      QueryDefinition: (def: QueryDefinition) => {
        visitorStack.push(def);
        return def;
      },
      ImportedQueryDefinition: (def: ImportedQueryDefinition) => {
        visitorStack.push(def);
        return def;
      },
      MethodDefinition: (def: MethodDefinition) => {
        const parent =
          visitorStack.length > 0
            ? visitorStack[visitorStack.length - 1]
            : undefined;

        return {
          ...def,
          parent,
        };
      },
    },
    leave: {
      QueryDefinition: (def: QueryDefinition) => {
        visitorStack.pop();
        return def;
      },
      ImportedQueryDefinition: (def: ImportedQueryDefinition) => {
        visitorStack.pop();
        return def;
      },
    },
  };
}
