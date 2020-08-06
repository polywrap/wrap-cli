import {
  IPFS,
  Buffer
} from "@web3api/wasm-ts";

export function getString(cid: string): string {
  const res = IPFS.cat(cid);
  return Buffer.toString(res);
}
