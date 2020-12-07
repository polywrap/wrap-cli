import {_w3_ipfs_add, _w3_ipfs_cat} from '../host/ipfs';

export type IPFSHash = string;
export type IPFSData = string; // TODO: Uint8Array

export class IPFS {
  static add(data: IPFSData): IPFSHash {
    return _w3_ipfs_add(data);
  }

  static cat(cid: IPFSHash): IPFSData {
    return _w3_ipfs_cat(cid);
  }
}
