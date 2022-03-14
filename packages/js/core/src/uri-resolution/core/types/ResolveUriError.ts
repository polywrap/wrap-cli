export enum EResolveUriErrorType {
  InfiniteLoop = "InfiniteLoop",
  Ens = "ENS",
  Fs = "FileSystem",
  Ipfs = "Ipfs",
}

export type ResolveUriError = {
  type: EResolveUriErrorType;
  error: Error;
};
