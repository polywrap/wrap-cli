import CID from 'cids';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import isIPFS from 'is-ipfs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import IPFSClient from 'ipfs-http-client';

export interface IIPFSConfig {
  provider: string;
}

export class IPFS {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: initialized within setProvider
  private _ipfs: IPFSClient;

  constructor(private _config: IIPFSConfig) {
    this.setProvider(_config.provider);
  }

  public static isCID(cid: string): boolean {
    return isIPFS.cid(cid) || isIPFS.cidPath(cid) || isIPFS.ipfsPath(cid);
  }

  public setProvider(provider: string): void {
    this._config.provider = provider;
    this._ipfs = new IPFSClient(provider);
  }

  public add(
    data: Uint8Array
  ): Promise<{
    path: string;
    cid: CID;
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
