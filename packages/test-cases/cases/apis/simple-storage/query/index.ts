import { Ethereum_Query } from "./w3/imported";
import {
  Input_getData,
  Input_tryGetData
} from "./w3";

export function getData(input: Input_getData): u32 {
  const res = Ethereum_Query.callContractView({
    address: input.address,
    method: "function get() view returns (uint256)",
    args: null,
    connection: input.connection
  });

  return U32.parseInt(res);
}

export function tryGetData(input: Input_tryGetData): string {
  const res = Ethereum_Query.Try.callContractView({
    address: input.address,
    method: "function badFunctionCall() view returns (uint256)",
    args: null,
    connection: input.connection
  });

  return res.unwrapErr();
}
