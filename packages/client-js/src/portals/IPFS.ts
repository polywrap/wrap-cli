const isIPFS = require("is-ipfs");

export interface IIPFSConfig {
  provider: string;
}

export class IPFS {
  constructor(private _config: IIPFSConfig) {
    // TODO: sanitization
  }

  public static isCID(cid: string) {
    return !isIPFS.cid(cid)
        && !isIPFS.cidPath(cid)
        && !isIPFS.ipfsPath(cid);
  }
}
