///////////
/// Lib ///
///////////

export {
  IPFS,
  IPFSHash
} from "./lib/IPFS";

////////////////
/// Lib Core ///
////////////////

// TODO:
/*export {
  BigInt
} from "./lib/core/BigInt";*/

export {
  Buffer
} from "./lib/core/Buffer";

export {
  Bytes
} from "./lib/core/Bytes";

///////////////////////////
/// ASM Runtime Helpers ///
///////////////////////////

export const UINT8ARRAY_ID = idof<Uint8Array>();
