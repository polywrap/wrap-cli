import { IPFS } from "../portals";
import { ASCModule } from "../lib/types";

// TODO: generate these types from the WASM interface (WITX)
export interface IIPFSImports {
  // TODO: wrap the types in type pointer classes that handle fetching
  // TODO: have ipfs_cat return a Uint8Array ptr once heap manager is implemented
  _w3_ipfs_add: (dataPtr: number /*Uint8Array*/) => Promise<number /*string*/>,
  _w3_ipfs_cat: (cidPtr: number /*string*/) => Promise<number /*string*/>
}

export function getIpfsImports(getModule: () => ASCModule, ipfs: IPFS): IIPFSImports {
  return {
    _w3_ipfs_add: async (dataPtr: number) => {
      const module = getModule();
      const {
        __getArray,
        __allocString,
        __retain
      } = module.exports;
      const data = Buffer.from(__getArray(dataPtr));
      const { cid } = await ipfs.add(data);
      return __retain(__allocString(cid.toString()));
    },
    _w3_ipfs_cat: async (cidPtr: number) => {
      const module = getModule();
      const {
        __getString,
        __allocString,
        __retain
      } = module.exports;
      const cid = __getString(cidPtr);
      const data = await ipfs.catToString(cid);
      return __retain(__allocString(data));
    }
  }
}
