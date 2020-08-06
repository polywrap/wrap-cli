import { getIpfsImports } from "./ipfs";
import { IPortals } from "../Web3API";
import { ASCImports } from "../lib/types";
import { WasmWorker } from "../lib/wasm-worker";

export function getHostImports(getWasmWorker: () => WasmWorker, portals: IPortals): ASCImports {
  const imports: ASCImports = { };

  if (portals.ipfs) {
    imports["ipfs"] = { ...getIpfsImports(getWasmWorker, portals.ipfs) };
  }

  return imports;
}
