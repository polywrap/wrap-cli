import { , Input_abstractQueryMethod, ImplementationType, Interface_Query_Factory, Interface } from "./w3";

// export function queryMethod(input: Input_queryMethod): ImplementationType {
//   const uris = Interface.getImplementations();
//   const impl = new Interface_Query_Factory(uris[0])
//   return impl.queryMethod(input.arg);
// }

export function abstractQueryMethod(input: Input_abstractQueryMethod): String {
  const uris = Interface.getImplementations();
  const impl = new Interface_Query_Factory(uris[0])
  return impl.abstractQueryMethod(input.arg);
}
