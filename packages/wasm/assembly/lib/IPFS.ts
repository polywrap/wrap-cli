import {
  __w3_ipfs_add,
  __w3_ipfs_get
} from "../host/ipfs";
import { Bytes } from "./core/Bytes";

export type IPFSHash = string;

export class IPFS {
  static add(data: Bytes): IPFSHash {
    return __w3_ipfs_add(data);
  }

  static get(path: IPFSHash): Bytes {
    return __w3_ipfs_get(path) as Bytes;
  }
}
