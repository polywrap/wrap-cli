import { Input_abstractMutationMethod, Input_mutationMethod, Interface, Interface_Mutation } from "./w3";

export function mutationMethod(input: Input_mutationMethod): u8 {
  const abstractInput: Input_abstractMutationMethod = {
    arg: input.arg
  }
  return abstractMutationMethod(abstractInput);
}

export function abstractMutationMethod(input: Input_abstractMutationMethod): u8 {
  const uris = Interface.getImplementations();
  const impl = new Interface_Mutation(uris[0])
  return impl.abstractMutationMethod({arg: input.arg});
}