# Schema Merging
input = multiple graphql files
sanitize & transform = import (subgraph types), merging (schema & mutation)
output = single graphql file

# Project Composition
- import external Web3API dependencies
- - .externals/Protocol/[web3api.yaml, mutation.wasm, query.wasm, etc]
- - folder as IPLD, allowing us to understand API dependency paths
