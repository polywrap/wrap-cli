declare module "@polywrap/ipfs-http-client-lite" {
  import { CID } from "multiformats";

  export interface IpfsClient {
    add(data: Uint8Array, options?: unknown): Promise<IpfsFileInfo[]>;

    cat(cid: string, options?: unknown): Promise<Buffer>;

    resolve(
      cid: string,
      options?: unknown
    ): Promise<{
      path: string;
    }>;
  }

  export interface IpfsFileInfo {
    name: string;
    hash: CID;
  }

  const createIpfsClient: (opts: unknown) => IpfsClient;

  export default createIpfsClient;
}
