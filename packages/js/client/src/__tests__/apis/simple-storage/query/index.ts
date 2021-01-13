import { Ethereum_Query } from "./w3/imported";

export function getData(address: string): u32 {
  const res = Ethereum_Query.callView({
    address,
    method: "function get() view returns (uint256)",
    args: []
  });

  return U32.parseInt(res);
}
