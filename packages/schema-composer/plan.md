# New Plan
- Output Schema & Mutation files seperately (for code-gen)
- Output combined file for build directory
- be able to process the #import syntax, which includes new @imported types, and adds to the @imports array on the module type (Query, Mutation)

# Schema Merging
input = multiple graphql files
sanitize & transform = import (subgraph types), merging (schema & mutation)
output = single graphql file

# Project Composition
- import external Web3API dependencies
- - .externals/Protocol/[web3api.yaml, mutation.wasm, query.wasm, etc]
- - folder as IPLD, allowing us to understand API dependency paths


## Tests

- Follow the test case pattern Jordan uses in schema-bindings package
- 