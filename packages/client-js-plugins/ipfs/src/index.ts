import { Query, Mutation } from "./schema";

import { Web3APIClientPlugin, Resolvers } from "@web3api/client-js-plugin";
import CID from "cids";

const isIPFS = require("is-ipfs");
const IpfsClient = require("ipfs-http-client");

export interface IpfsConfig {
  provider: string;
}

export class IpfsPlugin extends Web3APIClientPlugin {

  // @ts-ignore: initialized within setProvider
  private _ipfs: IpfsClient;

  constructor(private _config: IpfsConfig) {
    super();
    this.setProvider(_config.provider);
  }

  public getUris(): RegExp[] {
    return [
      // Matches: ipfs.eth
      // Matches: api.ipfs.web3api.eth
      /(.*[\.])?ipfs[\.].*/,
      // Matches: w3://ipfs
      /w3:\/\/ipfs/
    ];
  }

  public getResolvers(): Resolvers {
    return {
      Query: Query(this),
      Mutation: Mutation(this)
    };
  }

  public setProvider(provider: string) {
    this._config.provider = provider;
    this._ipfs = new IpfsClient(provider);
  }

  public async add(data: Uint8Array): Promise<{
    path: string,
    cid: CID,
  }> {
    return await this._ipfs.add(data);
  }

  public async cat(cid: string): Promise<Uint8Array> {
    return await this.catToBuffer(cid);
  }

  public async catToString(cid: string): Promise<string> {
    return (await this.catToBuffer(cid)).toString();
  }

  public async catToBuffer(cid: string): Promise<Uint8Array> {
    const chunks = []
    for await (const chunk of this._ipfs.cat(cid)) {
      chunks.push(chunk)
    }
    const result = Buffer.concat(chunks);
    const u8Array = new Uint8Array(result.byteLength);
    u8Array.set(result);
    return u8Array;
  }

  public ls(cid: string): AsyncIterable<{
    depth: number;
    name: string;
    type: string;
    path: string;
  }> {
    return this._ipfs.ls(cid);
  }

  public static isCID(cid: string) {
    return isIPFS.cid(cid)
        || isIPFS.cidPath(cid)
        || isIPFS.ipfsPath(cid);
  }
}
