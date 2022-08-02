# @polywrap/asyncify-js

A 0 dependency wrapper around the Node.JS & Browser `WebAssembly` instance, which adds support for [`asyncify`](https://emscripten.org/docs/porting/asyncify.html), enabling the use of async host import functions.

## Usage

```typescript
import { AsyncWasmInstance } from "@polywrap/asyncify-js";

// module.wasm must be asyncify enabled
const module: ArrayBuffer = getModule("./module.wasm");
const memory = new WebAssembly.Memory({ initial: 1 });

const instance = await AsyncWasmInstance.createInstance({
  module,
  imports: {
    my: {
      custom_import: async (arg: number): Promise<number> => {
        return await someAsyncCall(arg);
      }
    },
    env: {
      memory
    }
  }
});

await instance.exports.main();
```
