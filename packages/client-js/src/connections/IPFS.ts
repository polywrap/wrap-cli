export interface IIPFSConfig {
  provider: string;
}

export class IPFS {
  constructor(private config: IIPFSConfig) {
    // TODO: sanitization
  }
}
