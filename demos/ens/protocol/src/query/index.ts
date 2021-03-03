import { Ethereum_Query } from "./w3/imported";
import { Input_getData, Input_getResolver } from "./w3";

export function getData(input: Input_getData): u32 {
  const res = Ethereum_Query.callView({
    address: input.address,
    method: "function get() view returns (uint256)",
    args: [],
  });

  return U32.parseInt(res);
}

export function getResolver(address: Input_getResolver): String {
  return "hola";
}
