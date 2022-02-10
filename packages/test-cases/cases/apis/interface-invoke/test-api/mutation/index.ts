import {
  Interface,
  Interface_Mutation,
  Input_mutationMethod
} from "./w3";

export function mutationMethod(input: Input_mutationMethod): u8 {
  const uris = Interface.getImplementations();
  return Interface_Mutation.Interface.abstractMutationMethod(
    {arg: input.arg},
    uris[0]
  );
}
