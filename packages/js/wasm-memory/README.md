# @polywrap/wasm-memory-js

Helpers for instantiating and managing `WebAssembly.Memory` instances. Functionality includes:
- `getInitialPageCount(module: ArrayBuffer): number`: Extract the initial wasm memory page size, based on the pre-defined minimum length.
- `WasmMemoryPool`: A simple pool allocator for `WebAssembly.Memory` instances.
