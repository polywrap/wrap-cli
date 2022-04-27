import {
  Interface,
  Interface_Query,
  Input_queryMethod,
  ImplementationType
} from "./w3";

export function queryMethod(input: Input_queryMethod): ImplementationType {
  const uris = Interface.getImplementations();
  const result = new Interface_Query(uris[0]).abstractQueryMethod({
    arg: {
      str: input.arg.str
    }
  }).unwrap();
  return {
    str: result,
    uint8: input.arg.uint8,
  };
}
