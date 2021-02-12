import { query, mutation } from "./resolvers";
import { manifest } from "./manifest";

import {
  Client,
  Plugin,
  PluginManifest,
  PluginModules,
} from "@web3api/core-js";
import CID from "cids";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const isIPFS = require("is-ipfs");
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, @typescript-eslint/naming-convention
const IpfsClient = require("ipfs-http-client-lite");

export interface IpfsConfig {
  provider: string;
}

export class IpfsPlugin extends Plugin {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: initialized within setProvider
  private _ipfs: IpfsClient;

  constructor(private _config: IpfsConfig) {
    super();
    this.setProvider(this._config.provider);
  }

  public static manifest(): PluginManifest {
    return manifest;
  }

  public static isCID(cid: string): boolean {
    return isIPFS.cid(cid) || isIPFS.cidPath(cid) || isIPFS.ipfsPath(cid);
  }

  // TODO: generated types here from the schema.graphql to ensure safety `Resolvers<TQuery, TMutation>`
  // https://github.com/Web3-API/prototype/issues/101
  public getModules(_client: Client): PluginModules {
    return {
      query: query(this),
      mutation: mutation(this),
    };
  }

  public setProvider(provider: string): void {
    this._config.provider = provider;
    this._ipfs = IpfsClient(provider);
  }

  public async add(
    data: Uint8Array
  ): Promise<{
    path: string;
    cid: CID;
  }> {
    return await this._ipfs.add(data);
  }

  public async cat(cid: string): Promise<Uint8Array> {
    return await this.catToBuffer(cid);
  }

  public async catToString(cid: string): Promise<string> {
    const buffer = await this.catToBuffer(cid);
    const decoder = new TextDecoder();
    return decoder.decode(buffer);
  }

  public async catToBuffer(cid: string): Promise<Uint8Array> {
    return this._ipfs.cat(cid);
  }

  public ls(
    cid: string
  ): AsyncIterable<{
    depth: number;
    name: string;
    type: string;
    path: string;
  }> {
    return this._ipfs.ls(cid);
  }
}
