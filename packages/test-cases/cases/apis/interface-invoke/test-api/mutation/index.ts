import {
  Interface,
  Interface_Mutation,
  Input_mutationMethod
} from "./w3";

export function mutationMethod(input: Input_mutationMethod): u8 {
  const uris = Interface.getImplementations();
  const impl = new Interface_Mutation(uris[0])
  return impl.abstractMutationMethod({arg: input.arg});
}
