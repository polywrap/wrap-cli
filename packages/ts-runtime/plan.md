# AssemblyScript (WASM) Web3API Runtime
The plan is to create a WASM module that uses WASI for sending ETH_RPC calls. It is effectively an Ethers.js implementation in WASM. This means that the Web3API client will only have to handle initializing this module with a provider, and everything will be handled from within the Web3API WASM modules from there on out.

Other networks like IPFS and so one can be implemented as well, and most will not require the client to configure anything since they don't require any client resources (private key signing, etc).

## References
- WASI Interface: https://github.com/jedisct1/as-wasi/blob/master/assembly/as-wasi.ts
- ETH RPC: https://eth.wiki/json-rpc/API
- ETH JS RPC Library: https://github.com/ethereumjs/ethrpc


## Similar Projects
- https://docs.secondstate.io/buidl-developer-tool/why-buidl
  - BUIDL is an in-browser IDE for smart contracts + dapps
  - Only supports JS based dApps
