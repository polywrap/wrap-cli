import {
  __w3_ipfs_add,
  __w3_ipfs_get
} from "../host/ipfs";

export type IPFSHash = String;
export type IPFSData = Uint8Array;

export class IPFS {
  static add(data: IPFSData): IPFSHash {
    return __w3_ipfs_add(data);
  }

  static get(path: IPFSHash): IPFSData {
    return __w3_ipfs_get(path);
  }
}
