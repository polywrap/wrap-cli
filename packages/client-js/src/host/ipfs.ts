export interface Ipfs {
  _w3_ipfs_add: (data: Uint8Array) => String,
  _w3_ipfs_get: (path: String) => String
}
