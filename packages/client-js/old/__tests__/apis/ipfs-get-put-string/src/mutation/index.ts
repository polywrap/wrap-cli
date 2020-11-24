import {
  IPFS
} from "@web3api/wasm-as";

export function putString(input: string): string {
  return IPFS.add(input)
}
