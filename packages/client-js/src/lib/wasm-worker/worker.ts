import { workerData, parentPort } from "worker_threads";
import WASMLoader from "@assemblyscript/loader";

interface IWorkerData {
  sharedBuffer: SharedArrayBuffer;
  wasmSource: BufferSource;
  importNames: { [namespace: string]: string[] }
}

// Fetch worker data passed from host
const {
  sharedBuffer,
  wasmSource,
  importNames
} = workerData as IWorkerData;

// Construct a view into our shared buffer
const shared = new Int32Array(sharedBuffer, 0, 128);

// Initialize our host import wrappers
const imports: {
  [namespace: string]: {
    [method: string]: (...args: any[]) => void
  }
} = { }

for (const namespace of Object.keys(importNames)) {
  imports[namespace] = { };

  for (const method of importNames[namespace]) {
    imports[namespace][method] = function (...args: any[]) {
      // Notify the host of our impcall
      parentPort.postMessage({
        type: "impcall",
        namespace,
        method,
        args
      });

      // Wait for the call to finish
      let head = 0;

      while (true) {
        Atomics.wait(shared, head, 0);

        // Status has changed from 0, let's
        // see what's happening
        const type = shared[head++];

        // 1 === finished executing
        if (type === 1) {
          return shared[head];
        }

        const writing = type === 3 // 2 is reading
        const id = shared[head++]
        const ptr = shared[head++]
        const len = shared[head++]

        shareBuffer(id, writing, ptr, len);
      }
    }
  }
}

// Instantiate our WASM module
// @ts-ignore
let instance: any

try {
  // TODO: use assemblyscript/loader
  instance = WASMLoader.instantiateSync(wasmSource, imports);
} catch (error) {
  parentPort.postMessage({
    type: "error",
    error: error.message
  });
}

// TODO: necessary when we stop using the loader's memory manager
/*let mem = instance && instance.exports.memory &&
          new Uint8Array(((instance.exports.memory) as any).buffer)*/

// Listen for messages from the host
parentPort.on("message", function (message) {

  // Call a WASM method
  if (message.type === "call") {
    // Execute the call
    const result = instance.exports[message.method](
      ...message.args
    );

    // Return the result back to the host
    parentPort.postMessage({
      type: "result",
      id: message.id,
      result
    });
    return;
  }

  // Read from the shared buffer
  if (message.type === "read") {
    shareBuffer(message.id, false, message.pointer, message.length);
    return;
  }

  // Write to the shared buffer
  if (message.type === "write") {
    shareBuffer(message.id, true, message.pointer, message.length);
    return;
  }
});

function shareBuffer (id: number, writing: boolean, ptr: number, len: number) {
  const buf = new SharedArrayBuffer(len + 4)
  const lck = new Int32Array(buf, 0, 1)
  //const b = new Uint8Array(buf, 4, len)

  if (!writing) {
    // TODO: reading from WASM memory
    // b.set(mem.subarray(ptr, ptr + len))
  }

  parentPort.postMessage({
    type: 'buffer',
    id,
    buffer: buf
  })

  // Wait until 0 is set again by host
  Atomics.wait(lck, 0, 0)

  if (writing) {
    // TODO: writing to WASM memory
    // mem.set(b, ptr)
  }
}

