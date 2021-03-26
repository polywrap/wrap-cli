import { namehash } from "../utils";
import { Ethereum_Query, Input_getResolver } from "./w3";

export function getResolver(input: Input_getResolver): string {

  const name = namehash(input.name)
  
  const resolverAddress = Ethereum_Query.callView({
    address: input.address,
    method: "function resolver(bytes32 node) external view returns (address)",
    args: [
      name
    ],
  });

  const res = Ethereum_Query.callView({
    address: resolverAddress,
    method: "function addr(bytes32 node) external view returns (address)",
    args: [
      name
    ]
  })

  return res;
}