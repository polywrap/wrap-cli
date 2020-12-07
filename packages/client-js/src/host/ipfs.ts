import {IPFS} from '../portals';
import {WasmWorker, WasmCallback} from '../lib/wasm-worker';

// TODO: generate these types from the WASM interface (WITX)
export interface IIPFSImports {
  // TODO: wrap the types in type pointer classes that handle fetching
  // TODO: have ipfs_cat return a Uint8Array ptr once heap manager is implemented
  _w3_ipfs_add(dataPtr: number /*Uint8Array*/, cb: WasmCallback): Promise<void /*string*/>;
  _w3_ipfs_cat(cidPtr: number /*string*/, cb: WasmCallback): Promise<void /*string*/>;
}

export function getIpfsImports(getWasmWorker: () => WasmWorker, ipfs: IPFS): IIPFSImports {
  return {
    _w3_ipfs_add: async (dataPtr: number, cb: WasmCallback) => {
      const ww = getWasmWorker();
      const read = await ww.readStringAsync(dataPtr);
      const {cid} = await ipfs.add(Buffer.from(read.result));
      const write = await ww.writeStringAsync(cid.toString());
      cb(write.result);
    },
    _w3_ipfs_cat: async (cidPtr: number, cb: WasmCallback) => {
      const ww = getWasmWorker();
      const read = await ww.readStringAsync(cidPtr);
      const data = await ipfs.catToString(read.result);
      const write = await ww.writeStringAsync(data);
      cb(write.result);
    },
  };
}
