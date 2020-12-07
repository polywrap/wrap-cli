import {workerData, parentPort, MessagePort, receiveMessageOnPort} from 'worker_threads';
import WASMLoader from '@assemblyscript/loader';

interface IWorkerData {
  sharedBuffer: SharedArrayBuffer;
  wasmSource: BufferSource;
  importNames: {[namespace: string]: string[]};
}

type Message = {type: 'read-string'; id: string; pointer: number; value: string};

// Fetch worker data passed from host
const {sharedBuffer, wasmSource, importNames} = workerData as IWorkerData;

let secondaryPort: MessagePort | undefined = undefined;

// Construct a view into our shared buffer
const shared = new Int32Array(sharedBuffer, 0, 128);

// Initialize our host import wrappers
const imports: {
  [namespace: string]: {
    [method: string]: (...args: unknown[]) => void;
  };
} = {};

for (const namespace of Object.keys(importNames)) {
  imports[namespace] = {};

  for (const method of importNames[namespace]) {
    imports[namespace][method] = function (...args: unknown[]) {
      // Notify the host of our impcall
      parentPort.postMessage({
        type: 'impcall',
        namespace,
        method,
        args,
      });

      // Wait for the call to finish
      const head = 0;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        Atomics.wait(shared, head, 0, 500);

        // Status has changed from 0, let's
        // see what's happening
        const type = shared[head];

        // Process secondary messages
        const message = receiveMessageOnPort(secondaryPort);
        if (message) {
          handleSecondaryMessage(message.message);
        }

        // 1 === finished executing
        if (type === 1) {
          return shared[head + 1];
        }
      }
    };
  }
}

// Instantiate our WASM module
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let instance: any;

try {
  instance = WASMLoader.instantiateSync(wasmSource, imports);
} catch (error) {
  instance = undefined;
  parentPort.postMessage({
    type: 'error',
    error: error.message,
  });
}

// "Master" port for messages from the host
parentPort.on('message', function (message) {
  // Call a WASM method
  if (message.type === 'call') {
    // Execute the call
    const result = instance.exports[message.method](...message.args);

    // Return the result back to the host
    parentPort.postMessage({
      type: 'result',
      id: message.id,
      result,
    });
    return;
  }

  if (message.type === 'spawn-sub-port') {
    spawnSecondaryPort(message.port);
  }

  if (message.type === 'kill-sub-port') {
    killSecondaryPort();
  }
});

function handleSecondaryMessage(message: Message) {
  // Read a string from WASM
  if (message.type === 'read-string') {
    const {__getString} = instance.exports;
    const result = __getString(message.pointer);
    secondaryPort.postMessage({
      type: 'result',
      id: message.id,
      result,
    });
    return;
  }

  // Write a string to WASM
  if (message.type === 'write-string') {
    const {__allocString, __retain} = instance.exports;
    const result = __retain(__allocString(message.value));
    // TODO: use types for all of these message payloads
    secondaryPort.postMessage({
      type: 'result',
      id: message.id,
      result,
    });
    return;
  }
}

function spawnSecondaryPort(port: MessagePort) {
  if (secondaryPort) {
    throw Error('The secondary port has been spawned twice.');
  }

  secondaryPort = port;
  secondaryPort.on('message', (message) => {
    handleSecondaryMessage(message);
  });
}

function killSecondaryPort() {
  if (!secondaryPort) {
    return;
  }

  secondaryPort.close();
  secondaryPort = undefined;
}
