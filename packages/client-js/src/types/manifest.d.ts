// TODO: remove me when this is automatically generated in the
//       @web3api/manifest package based on the JSON-Schema
interface FilePath {
  file: string;
}

interface ModulePath {
  language: "wasm/assemblyscript";
  file: string;
}

interface ClientModule {
  schema: FilePath;
  module: ModulePath;
}

export interface Manifest {
  description?: string;
  repository?: string;
  schema: FilePath;
  mutation?: ClientModule;
  query?: ClientModule;
  subgraph?: FilePath;
}
