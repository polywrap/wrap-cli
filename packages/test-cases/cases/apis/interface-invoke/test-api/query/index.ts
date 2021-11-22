import { Input_abstractQueryMethod, Interface_Query, Interface, Input_queryMethod, ImplementationType } from "./w3";

export function abstractQueryMethod(input: Input_abstractQueryMethod): string {
  const uris = Interface.getImplementations();
  const impl = new Interface_Query(uris[0])
  return impl.abstractQueryMethod({arg: {str: input.arg.str}});
}

export function queryMethod(input: Input_queryMethod): ImplementationType {
  const result = abstractQueryMethod({arg: {str: input.arg.str}});
  return {
    str: result,
    uint8: input.arg.uint8,
  }
}