import { TypeInfoTransforms } from ".";
import { GenericDefinition } from "../typeInfo";

export function parentPointers(): TypeInfoTransforms {
  const visitorStack: GenericDefinition[] = [];

  return {
    enter: {
      GenericDefinition: (def: GenericDefinition) => {
        let parent: GenericDefinition | undefined;

        if (visitorStack.length > 0) {
          parent = visitorStack[visitorStack.length - 1];
        }

        visitorStack.push(def);

        return {
          ...def,
          parent
        };
      },
    },
    leave: {
      GenericDefinition: (def: GenericDefinition) => {
        visitorStack.pop();
        return def;
      }
    }
  };
}
