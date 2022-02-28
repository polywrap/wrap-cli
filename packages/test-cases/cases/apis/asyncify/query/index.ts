import { Ethereum_Query } from "./w3/imported";
import { Input_getData } from "./w3";

export function getData(input: Input_getData): u32 {
  const res = Ethereum_Query.callContractView({
    address: input.address,
    method: "function get() view returns (uint256)",
    args: null,
    connection: input.connection
  }).unwrap();

  return U32.parseInt(res);
}

export function returnTrue(): boolean {
  return true;
}
