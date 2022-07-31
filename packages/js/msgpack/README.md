# @polywrap/msgpack-js

TypeScript / JavaScript implementation of the WRAP MsgPack encoding standard.

## Usage

```typescript
import { msgpackEncode, msgpackDecode } from "@polywrap/msgpack-js";

const test = {
  foo: 5,
  bar: [true, false],
  baz: {
    prop: "value"
  }
};

const encoded: Uint8Array = msgpackEncode(test);

const decoded = msgpackDecode(encoded);

expect(decoded).toEqual(test);
```
