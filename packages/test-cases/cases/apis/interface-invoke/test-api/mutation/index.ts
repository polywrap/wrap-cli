import { Input_mutationMethod, Input_abstractMutationMethod, Interface, Interface_Mutation_Factory } from "./w3";

export function mutationMethod(input: Input_mutationMethod): u8 {
  const uris = Interface.getImplementations();
  const impl = new Interface_Mutation_Factory(uris[0])
  return impl.mutationMethod(input.arg);
}

export function abstractMutationMethod(input: Input_abstractMutationMethod): u8 {
  const uris = Interface.getImplementations();
  const impl = new Interface_Mutation_Factory(uris[0])
  return impl.abstractMutationMethod(input.arg);
}
