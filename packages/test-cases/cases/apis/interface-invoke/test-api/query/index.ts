import {
  Interface,
  Interface_Query,
  Input_queryMethod,
  ImplementationType
} from "./w3";

export function queryMethod(input: Input_queryMethod): ImplementationType {
  const uris = Interface.getImplementations();
  const result = Interface_Query.Interface.abstractQueryMethod(
    {arg: {str: input.arg.str}},
    uris[0]
  );
  return {
    str: result,
    uint8: input.arg.uint8,
  };
}
