import { Ethereum_Query } from "./w3/imported";
import {  Input_getResolver } from "./w3";
import { hash } from "eth-ens-namehash"

export function getResolver(input: Input_getResolver): string {
  const namehash = hash(input.name)
  const res = Ethereum_Query.callView({
    address: input.address,
    method: "function resolver(bytes32 node) external view returns (address)",
    args: [
      // namehash
    ],
  });

  return res;
}
