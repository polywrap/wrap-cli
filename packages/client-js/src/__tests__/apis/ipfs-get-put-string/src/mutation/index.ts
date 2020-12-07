import {IPFS} from '@web3api/wasm-ts';

export function putString(input: string): string {
  return IPFS.add(input);
}
