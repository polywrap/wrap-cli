import {
  Ethereum,
  IPFS
} from "./portals";
import { DocumentNode } from "graphql/language";

interface IPortals {
  ipfs: IPFS;
  ethereum: Ethereum;
}

export interface IWeb3APIConfig {
  uri: string;
  portals: IPortals;
}

export class Web3API {
  constructor(private _config: IWeb3APIConfig) {
    // Sanitize API URI
    this.setUri(this._config.uri);
  }

  public setUri(uri: string) {
    if (!IPFS.isCID(uri) && !Ethereum.isENSDomain(uri)) {
      throw Error(`The Web3API URI provided is neither a ENS domain or an IPFS multihash: ${uri}`);
    }

    this._config.uri = uri;
  }

  public getPortal<T extends keyof IPortals>(
    name: T
  ) {
    return this._config.portals[name];
  }

  public setPortal<T extends keyof IPortals>(
    name: T, portal: IPortals[T]
  ) {
    this._config.portals[name] = portal;
  }

  public query(query: DocumentNode, variables?: { [name: string]: any }) {
    // TODO:
    // 1 Parse query & build plan
    // 1 Fetch Web3API package from URI
    // - - only get relevant parts (future optimization)
    // 2 Execute query plan
    // - - load WASM module if necessary
  }
}
