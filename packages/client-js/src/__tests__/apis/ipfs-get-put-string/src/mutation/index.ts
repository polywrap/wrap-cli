import {
  IPFS,
  Buffer
} from "@web3api/wasm-ts";

export function putString(input: string): string {
  return IPFS.add(Buffer.fromString(input))
}
