# Plan
## Marshalling
1. Serialize Input Arguments = GraphQL -> JSON -> MsgPack (verify w/ graphql schema) [client-js]
2. Deserialize Input Arguments = MsgPack -> WASM-Assemblyscript [wasm-as,wasm-as-codegen]
3. Serialize Return Value = WASM-Assemblyscript -> MsgPack [wasm-as,wasm-as-codegen]
4. Deserialize Return Value = MsgPack -> JSON (verify w/ graphql schema) [client-js]
5. Host Calls = GraphQL? Assemblyscript -> MsgPack?

## Overview
1. Remove all Ethereum, IPFS, and Graph host imports
2. Create the host import for querying other Web3APIs _w3_query_api(...)
3. Add the concept of Web3API Client + Definition + Instance
4. Support JS & WASM based Web3APIs
5. Create JS Web3APIs for Ethereum, IPFS
6. Add support for custom URI resolvers
7. Create WASM Web3APIs

## CodeGen
- Layout the folder structure
- Refactor the MsgPack AS implementation to be simpler
- Integrate code-gen into the CLI
- Create an e2e test, requiring the rest of the pipeline to be implemented
- Define standard for invoking methods inside module, and invoking methods outside