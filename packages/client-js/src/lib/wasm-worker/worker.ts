import { workerData, parentPort } from "worker_threads";
import WasmLoader from "@assemblyscript/loader";
import { WasmImportSig } from "../types/wasm";

interface IWorkerData {
  sharedBuffer: SharedArrayBuffer;
  wasmSource: BufferSource;
  importSigs: {
    [namespace: string]: {
      [method: string]: WasmImportSig
    }
  }
}

// Fetch worker data passed from host
const {
  sharedBuffer,
  wasmSource,
  importSigs
} = workerData as IWorkerData;

// Construct a view into our shared buffer
const shared = new Int32Array(sharedBuffer, 0, 128);

// Instantiate our WASM module
// @ts-ignore
let instance: any

// Initialize our host import wrappers
const imports: {
  [namespace: string]: {
    [method: string]: (...args: any[]) => void
  }
} = { }

for (const namespace of Object.keys(importSigs)) {
  imports[namespace] = { };

  for (const method of Object.keys(importSigs[namespace])) {
    imports[namespace][method] = function (...args: any[]) {

      const { __getString } = instance.exports;
      const sig = importSigs[namespace][method];
      const marshedArgs: any[] = [];

      for (let i = 0; i < sig.args.length; ++i) {
        const argType = sig.args[i];

        if (argType === "string") {
          marshedArgs.push(
            __getString(args[i])
          );
        } else {
          throwError(`WORKER: Unable to marshal argument, unknown type '${argType}'`);
        }
      }

      // Notify the host of our impcall
      parentPort.postMessage({
        type: "impcall",
        namespace,
        method,
        args: marshedArgs
      });

      // Wait for the call to finish
      let head = 0;

      Atomics.wait(shared, head, 0);

      // Status has changed from 0, let's
      // see what's happening
      const type = shared[head];

      // 1 === finished executing
      if (type === 1) {
        return shared[head + 1];
      } else {
        throwError(`WORKER: Unrecognized status code from host '${type}'`);
      }
    }
  }
}

try {
  instance = WasmLoader.instantiateSync(wasmSource, imports);
} catch (error) {
  throwError(error.message);
}

// "Master" port for messages from the host
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
});

function throwError(msg: string) {
  const error = new Error(msg);
  parentPort.postMessage({
    type: "error",
    error: error.message
  });
  throw error;
}
