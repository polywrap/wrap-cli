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

export type IpfsFileInfo = {
  name: string;
  hash: CID;
};
