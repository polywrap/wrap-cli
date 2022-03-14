export enum EResolveUriErrorType {
  InfiniteLoop = "InfiniteLoop",
  Ens = "ENS",
  Fs = "FileSystem",
}

export type ResolveUriError = {
  type: EResolveUriErrorType;
  error: Error;
};
