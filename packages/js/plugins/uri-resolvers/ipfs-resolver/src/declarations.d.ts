declare module "is-ipfs" {
  export interface IsIpfs {
    cid(value: string): boolean;
    cidPath(value: string): boolean;
    ipfsPath(value: string): boolean;
  }

  const isIpfs: IsIpfs;

  export default isIpfs;
}
