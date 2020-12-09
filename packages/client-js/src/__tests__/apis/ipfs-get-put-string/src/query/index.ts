import { IPFS } from "@web3api/wasm-ts";

export function getString(cid: string): string {
  return IPFS.cat(cid);
}
