import {
  IPFS,
  Buffer
} from "@web3api/wasm-ts";

export function getString(cid: string): string {
  return Buffer.toString(IPFS.cat(cid));
}
