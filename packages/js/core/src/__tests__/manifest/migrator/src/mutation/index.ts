import { Ethereum } from "@web3api/wasm-ts";

export function setInformation(): string {
  return Ethereum.sendTransaction("0x", "myMethod", "");
}
