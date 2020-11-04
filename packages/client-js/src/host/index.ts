import { ASCImports } from "../lib/types/wasm/asc";
import { WasmWorker } from "../lib/wasm-worker";

export function getHostImports(getWasmWorker: () => WasmWorker): ASCImports {
  const imports: ASCImports = { };

  return imports;
}
