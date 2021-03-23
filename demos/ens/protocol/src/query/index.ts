import { Ethereum_Query } from "./w3/imported";
import { ENSNamehash_Query, Input_getResolver } from "./w3";

export function getResolver(input: Input_getResolver): string {
  const name = ENSNamehash_Query.hash({ value: "alice.eth"});
  const res = Ethereum_Query.callView({
    address: input.address,
    method: "function resolver(bytes32 node) external view returns (address)",
    args: [
      name
    ],
  });

  return res;
}
