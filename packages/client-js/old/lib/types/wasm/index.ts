export type WasmLanguages = "wasm/assemblyscript";

export type WasmImportArgTypes = "string"
export type WasmImportRetTypes = "string"

export interface WasmImportSig {
  args: WasmImportArgTypes[],
  ret: WasmImportRetTypes
}

export interface WasmImport {
  func: (...args: any) => Promise<any>,
  sig: WasmImportSig
}

export interface WasmImports {
  [namespace: string]: {
    [funcName: string]: WasmImport
  }
}
