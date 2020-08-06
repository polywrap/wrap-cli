const isIPFS = require("is-ipfs");
const IPFSClient = require("ipfs-http-client");
import CID from "cids";

export interface IIPFSConfig {
  provider: string;
}

export class IPFS {

  // @ts-ignore: initialized within setProvider
  private _ipfs: IPFSClient;

  constructor(private _config: IIPFSConfig) {
    this.setProvider(_config.provider);
  }

  public setProvider(provider: string) {
    this._config.provider = provider;
    this._ipfs = new IPFSClient(provider);
  }

  public add(data: Uint8Array): Promise<{
    path: string,
    cid: CID,
  }> {
    return this._ipfs.add(data);
  }

  public cat(cid: string): AsyncIterable<Buffer> {
    return this._ipfs.cat(cid);
  }

  public async catToString(cid: string): Promise<string> {
    return (await this.catToBuffer(cid)).toString();
  }

  public async catToBuffer(cid: string): Promise<ArrayBuffer> {
    const chunks = [];

    for await (const chunk of await this.cat(cid)) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
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
