import { Input_abstractMutationMethod, Interface, Interface_Mutation_Factory } from "./w3";

export function abstractMutationMethod(input: Input_abstractMutationMethod): u8 {
  const uris = Interface.getImplementations();
  const impl = new Interface_Mutation_Factory(uris[0])
  return impl.abstractMutationMethod(input.arg);
}
