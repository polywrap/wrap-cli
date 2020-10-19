// TODO: remove me when this is automatically generated in the
//       @web3api/manifest package based on the JSON-Schema
import { WasmLanguages } from "./wasm"

export interface FilePath {
  file: string;
}

export interface WasmModulePath extends FilePath {
  language: WasmLanguages;
}

export interface ClientModule {
  schema: FilePath;
  module: WasmModulePath;
}

export interface Manifest {
  description?: string;
  repository?: string;
  schema: FilePath;
  mutation?: ClientModule;
  query?: ClientModule;
  subgraph?: FilePath & { id?: string };
}
