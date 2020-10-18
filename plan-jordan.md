# Plan
## Shared WASM Heap
1. Base GraphQL Types Defined
```
String,
UInt[8, 16, 32, 64, 256]
Int[8, 16, 32, 64, 256]
Char => Uint8
WChar => Uint16
Byte => Uint8
Boolean => Uint8
```

2. AssemblyScriptHeap
```
allocate(type): ptr
set(value)
get(ptr)
```

3. 

3. WasmWorker












# Goals
- In-Browser Support
- Moloch Web3API (signing, ethereum, ipfs)
- Fleek Web3API (signing, ipfs?, filecoin?)
- Clear Specification For: Web3API Packages (Manifest, Schemas, Modules), Web3API Clients (Initialization, Querying)
