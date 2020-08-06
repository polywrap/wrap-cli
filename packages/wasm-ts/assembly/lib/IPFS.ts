import {
  _w3_ipfs_add,
  _w3_ipfs_cat
} from "../host/ipfs";
import {
  Buffer
} from "../lib/core/Buffer";

export type IPFSHash = string;
export type IPFSData = Uint8Array;

export class IPFS {
  static add(data: IPFSData): IPFSHash {
    return _w3_ipfs_add(data);
  }

  static cat(cid: IPFSHash): IPFSData {
    const str = _w3_ipfs_cat(cid);
    return Buffer.fromString(str);
  }
}
