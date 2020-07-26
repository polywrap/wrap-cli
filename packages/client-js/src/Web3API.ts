import { IPFS } from "./connections"

export interface IWeb3APIConfig {
  uri: string;
  connections: {
    ipfs: IPFS;
  };
}

export class Web3API {
  constructor(private config: IWeb3APIConfig) {
    // TODO: sanitization
    // - uri -> is multihash or ENS
    // - connections -> ...
  }
}
