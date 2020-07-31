import { IPFS } from "../portals";
import { ASCModule } from "../types";

// TODO: generate these types from the WASM interface (WITX)
export interface IIPFSImports {
  // TODO: wrap the types in type pointer classes that handle fetching
  _w3_ipfs_add: (dataPtr: number /*Uint8Array*/) => Promise<number /*string*/>,
  _w3_ipfs_cat: (cidPtr: number /*string*/) => Promise<number /*Uint8Array*/>
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
        __allocArray,
        __retain,
        UINT8ARRAY_ID
      } = module.exports;
      const cid = __getString(cidPtr);
      const data = new Uint8Array(await ipfs.catToBuffer(cid));
      return __retain(__allocArray(UINT8ARRAY_ID, data));
    }
  }
}
