import {
  IPFS
} from "@web3api/wasm-as";

export function getString(cid: string): string {
  return IPFS.cat(cid);
}
