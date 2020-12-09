import { Ethereum } from "../portals";
import { WasmWorker, WasmCallback } from "../lib/wasm-worker";

export interface IEthereumImports {
  _w3_eth_callView(addressPtr: number, methodPtr: number, argsPtr: number, cb: WasmCallback): Promise<void /*string*/>;

  _w3_eth_sendTransaction(
    addressPtr: number,
    methodPtr: number,
    argsPtr: number,
    cb: WasmCallback
  ): Promise<void /*string*/>;

  _w3_eth_deployContract(abiPtr: number, bytecodePtr: number, cb: WasmCallback): Promise<void /*string*/>;
}

export function getEthImports(getWasmWorker: () => WasmWorker, ethereum: Ethereum): IEthereumImports {
  return {
    _w3_eth_callView: async (addressPtr: number, methodPtr: number, argsPtr: number, cb: WasmCallback) => {
      const ww = getWasmWorker();
      const address = (await ww.readStringAsync(addressPtr)).result;
      const method = (await ww.readStringAsync(methodPtr)).result;
      const args = (await ww.readStringAsync(argsPtr)).result;
      const value = await ethereum.callView(address, method, args);
      const result = (await ww.writeStringAsync(value)).result;
      cb(result);
    },
    _w3_eth_sendTransaction: async (addressPtr: number, methodPtr: number, argsPtr: number, cb: WasmCallback) => {
      const ww = getWasmWorker();
      const address = (await ww.readStringAsync(addressPtr)).result;
      const method = (await ww.readStringAsync(methodPtr)).result;
      const args = (await ww.readStringAsync(argsPtr)).result;
      const value = await ethereum.sendTransaction(address, method, args);
      const result = (await ww.writeStringAsync(value)).result;
      cb(result);
    },
    _w3_eth_deployContract: async (abiPtr: number, bytecodePtr: number, cb: WasmCallback) => {
      const ww = getWasmWorker();
      const abi = (await ww.readStringAsync(abiPtr)).result;
      const bytecode = (await ww.readStringAsync(bytecodePtr)).result;
      const address = await ethereum.deployContract(abi, bytecode);
      const result = (await ww.writeStringAsync(address)).result;
      cb(result);
    },
  };
}
