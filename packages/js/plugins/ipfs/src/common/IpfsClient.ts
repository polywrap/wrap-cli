import CID from "cids";

export interface IpfsClient {
  add(
    data: Uint8Array,
    options?: unknown
  ): Promise<
    {
      name: string;
      hash: CID;
    }[]
  >;

  cat(cid: string, options?: unknown): Promise<Buffer>;

  resolve(
    cid: string,
    options?: unknown
  ): Promise<{
    path: string;
  }>;
}
