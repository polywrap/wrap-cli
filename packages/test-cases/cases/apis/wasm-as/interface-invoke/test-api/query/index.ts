import {
  Interface,
  Interface_Query,
  Input_moduleMethod,
  ImplementationType
} from "./w3";

export function moduleMethod(input: Input_moduleMethod): ImplementationType {
  const uris = Interface.getImplementations();
  const result = new Interface_Query(uris[0]).abstractModuleMethod({
    arg: {
      str: input.arg.str
    }
  }).unwrap();
  return {
    str: result,
    uint8: input.arg.uint8,
  };
}
