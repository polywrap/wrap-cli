import fs from "fs";

const IPFSClient = require("ipfs-http-client");
const { globSource } = IPFSClient;

export interface IPublisherConfig {
  buildPath: string;
  ipfs: string;
}

export class Publisher {
  // @ts-ignore
  private _ipfs: IPFSClient;

  constructor(private _config: IPublisherConfig) {
    let url;
    try {
      url = new URL(_config.ipfs);
    } catch (e) {
      throw Error(`IPFS URL Malformed: ${_config.ipfs}\n${e}`)
    }

    this._ipfs = new IPFSClient(_config.ipfs);
  }

  public async publishToIPFS(): Promise<string> {
    const globOptions = {
      recursive: true
    };

    const addOptions = {
      wrapWithDirectory: false
    };

    let rootCID = '';

    for await (const file of this._ipfs.addAll(globSource(
      this._config.buildPath, globOptions
    ), addOptions)) {
      if (file.path.indexOf('/') === -1) {
        rootCID = file.cid.toString();
      }
    }

    return rootCID;
  }
}
