import {
  Interface,
  Interface_Mutation,
  Input_mutationMethod
} from "./w3";

export function mutationMethod(input: Input_mutationMethod): u8 {
  const uris = Interface.getImplementations();
  return new Interface_Mutation(uris[0]).abstractMutationMethod({
    arg: input.arg
  }).unwrap();
}
