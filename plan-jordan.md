# Plan
## Marshalling
1. Serialize Input Arguments = GraphQL -> JSON -> MsgPack (verify w/ graphql schema) [client-js]
2. Deserialize Input Arguments = MsgPack -> WASM-Assemblyscript [wasm-as,wasm-as-codegen]
3. Serialize Return Value = WASM-Assemblyscript -> MsgPack [wasm-as,wasm-as-codegen]
4. Deserialize Return Value = MsgPack -> JSON (verify w/ graphql schema) [client-js]
5. Host Calls = GraphQL? Assemblyscript -> MsgPack?
