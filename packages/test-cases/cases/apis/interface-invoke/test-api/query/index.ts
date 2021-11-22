import {
  Interface,
  Interface_Query,
  Input_queryMethod,
  ImplementationType
} from "./w3";

export function queryMethod(input: Input_queryMethod): ImplementationType {
  const uris = Interface.getImplementations();
  const impl = new Interface_Query(uris[0])
  const result = impl.abstractQueryMethod({arg: {str: input.arg.str}});
  return {
    str: result,
    uint8: input.arg.uint8,
  };
}
