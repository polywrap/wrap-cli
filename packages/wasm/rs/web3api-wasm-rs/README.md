# WEB3-API RUST-WASM RUNTIME

## TASK

```bash
[ ] Create a Rust WASM runtime for the Web3API standard
  - MsgPack: Serialization & Deseralization
  - Web3ApiClient Imports: `__w3_subinvoke`, `__w3_abort`, etc
  Reference: ./packages/wasm/as/

[ ] Defining the generated code for the Web3API Schema Bindings
  - Create test case that has the predefined output, used to test the templates against
  - Create Mustache string-templates for the necessary generated code
    - [ ] Object Types
    - [ ] Enums
    - [ ] Wrapped Query Methods
    - [ ] Imported: Queries, Objects, Enums
  Reference: ./packages/schema/bind/src/bindings/wasm-as/
  Create: ./packages/schema/bind/src/bindings/wasm-rs/
  Reference: ./packages/test-cases/cases/bind/sanity/output/wasm-as/
  Create: ./packages/test-cases/cases/bind/sanity/output/wasm-rs/
```
