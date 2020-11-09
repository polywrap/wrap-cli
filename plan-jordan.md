# Plan
## Marshalling
1. Serialize Input Arguments = GraphQL -> JSON -> MsgPack (verify w/ graphql schema) [client-js]
2. Deserialize Input Arguments = MsgPack -> WASM-Assemblyscript [wasm-as,wasm-as-codegen]
3. Serialize Return Value = WASM-Assemblyscript -> MsgPack [wasm-as,wasm-as-codegen]
4. Deserialize Return Value = MsgPack -> JSON (verify w/ graphql schema) [client-js]
5. Host Calls = GraphQL? Assemblyscript -> MsgPack?

## Overview
x. Remove all Ethereum, IPFS, and Graph host imports
x. Create the host import for querying other Web3APIs _w3_query_api(...)
x. Add the concept of Web3API Client + Definition + Instance
x. Support JS & WASM based Web3APIs
x. Create JS Web3APIs for Ethereum, IPFS
6. Add support for custom URI resolvers
7. Create WASM Web3APIs

## CodeGen
x Layout the folder structure
x Refactor the MsgPack AS implementation to be simpler
- Integrate code-gen into the CLI
- Create an e2e test, requiring the rest of the pipeline to be implemented
- Define standard for invoking methods inside module, and invoking methods outside

## Client
1. Re-create the WasmWorker: marshal on the thread, send Javascript objects to/from main, marshal into module
