import { WasmImports } from "../types/wasm";

import { Worker } from "worker_threads";
import { EventEmitter } from "events";
import path from "path";

export type WasmCallback = (
  result: number,
  error?: Error
) => void;

export type MessageCallback = (
  result: any,
  error?: Error
) => void;

function noop () {}

export class WasmWorker extends EventEmitter {
  public destroyed: boolean;

  private _worker: Worker;
  private _shared: Int32Array;
  private _head: number;
  private _callbacks: (WasmCallback | MessageCallback)[];

  constructor(wasmSource: BufferSource, imports: WasmImports) {
    super();

    // Initialize a shared buffer
    const sharedBuffer = new SharedArrayBuffer(4 * 128);

    // Aggregate import method signatures
    const importSigs: any = { };

    Object.keys(imports).forEach((namespace: string) => {
      const methods: any = { };

      Object.keys(imports[namespace]).forEach((methodName: string) => {
        const { sig } = imports[namespace][methodName];
        methods[methodName] = sig;
      });

      importSigs[namespace] = methods;
    })

    const workerFile = process.env.WORKER_ENV === 'test'
      ? 'worker-import.js'
      : 'worker.js';

    const worker = new Worker(path.resolve(__dirname, workerFile), {
      workerData: {
        sharedBuffer,
        wasmSource,
        importSigs
      }
    });

    this.destroyed = false;
    this._worker = worker;
    this._shared = new Int32Array(sharedBuffer, 0, 128);
    this._head = 0;
    this._callbacks = [];

    worker.on('message', (m) => {

      // Posting the result of a WASM call
      if (m.type === "result") {
        const cb = this._getCallback(m.id);
        cb(m.result, null);
        return;
      }

      // Execute an import method from WASM
      if (m.type === "impcall") {
        // Locate the import being called
        const { func, sig } = imports[m.namespace][m.method];

        if (!func || typeof func !== 'function') {
          const error = new Error(
            `HOST: impcall failed to locate import. ${m.namespace}.${m.method}`
          );
          this.emit("error", error);
          return;
        }

        if (func.length !== sig.args.length) {
          const error = new Error(
            'HOST: import signature has incorrect number of arguments. ' +
            `Expected ${func.length} but got ${sig.args.length}. ${m.namespace}.${m.method}`
          );
          this.emit("error", error);
          return;
        }

        // Add a callback to the arguments,
        // letting the import function notify us when
        // it's finished executing
        const callback: WasmCallback = (result: number, error?: Error) => {
          // Cache the current head, this is the index
          // the worker is waiting to be notified at
          const head = this._head;

          // TODO: use types for status codes
          // 1 === finished
          this._shared[this._head++] = 1;
          this._shared[this._head++] = error ? -1 : result;
          Atomics.notify(this._shared, head, Infinity);
        }
        m.args.push(callback);

        // Reset our buffer's head and exec the call
        this._head = 0;
        func(...m.args);
        return;
      }

      if (m.type === "log") {
        console.log(m.log);
        return;
      }

      // If an error occurs within the worker
      if (m.type === "error") {
        const error = new Error(m.error);
        this.emit("error", error);
        return;
      }
    });
  }

  // Call a WASM exported method
  public call(method: string, ...args: any[]) {
    // Get the callback appended to the arguments
    // if it exists
    const cb = (
      args.length &&
      typeof args[args.length - 1] === 'function'
    ) ? args.pop() : noop

    // Don't continue if we're destroying ourselves
    if (this.destroyed) {
      return process.nextTick(cb, -1, new Error('Worker destroyed'))
    }

    // Get a new callback ID
    const id = this._callbacks.length;

    // Save the callback at callbacks[id]
    this._callbacks.push(cb);

    // Post our execution to the worker
    this._worker.postMessage({
      type: 'call',
      id,
      method,
      args
    })
  }

  public async callAsync(method: string, ...args: any[]): Promise<{
    error: Error | null,
    result: number
  }> {
    if (args.length && typeof args[args.length - 1] === 'function') {
      throw Error("No callback argument supported on Async method, await result.");
    }

    return new Promise((resolve) => {
      this.call(method, ...args, (result: number, error: Error | null) => {
        resolve({
          error,
          result
        })
      })
    })
  }

  // Destroy this WASM worker
  public destroy () {
    this.destroyed = true
    this._worker.terminate()

    while (this._callbacks.length) {
      const cb = this._getCallback(this._callbacks.length - 1)
      cb(-1, new Error('Worker destroyed'))
    }
  }

  // Fetch a callback given its ID
  private _getCallback(id: number): WasmCallback {
    const cb = this._callbacks[id]
    this._callbacks[id] = null
    while (
      this._callbacks.length &&
      this._callbacks[this._callbacks.length - 1] === null
    ) {
      this._callbacks.pop()
    }
    return cb
  }
}
