import { getIpfsImports } from "./ipfs";
import { getEthImports } from "./ethereum";
import { IPortals } from "../Web3API";
import { ASCImports } from "../lib/types";
import { WasmWorker } from "../lib/wasm-worker";

export function getHostImports(getWasmWorker: () => WasmWorker, portals: IPortals): ASCImports {
  const imports: ASCImports = { };

  if (portals.ipfs) {
    imports["ipfs"] = { ...getIpfsImports(getWasmWorker, portals.ipfs) };
  }

  if (portals.ethereum) {
    imports["ethereum"] = { ...getEthImports(getWasmWorker, portals.ethereum) };
  }

  return imports;
}
