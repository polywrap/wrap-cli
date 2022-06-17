import {
  Interface,
  Interface_Module,
  Input_moduleMethod,
  ImplementationType
} from "./wrap";

export function moduleMethod(input: Input_moduleMethod): ImplementationType {
  const uris = Interface.getImplementations();
  const result = new Interface_Module(uris[0]).abstractModuleMethod({
    arg: {
      str: input.arg.str
    }
  }).unwrap();
  return {
    str: result,
    uint8: input.arg.uint8,
  };
}
