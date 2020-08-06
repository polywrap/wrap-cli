import { ASCImports } from "../types";

import { Worker } from "worker_threads";
import { EventEmitter } from "events";
import path from "path";

type Callback = (error: Error | null, result: number) => void;

function noop () {}

export class WasmWorker extends EventEmitter {
  public destroyed: boolean;

  private _worker: Worker;
  private _shared: Int32Array;
  private _calling: boolean;
  private _head: number;
  private _callbacks: any[];

  constructor(wasmSource: BufferSource, imports: ASCImports) {
    super();

    // Initialize a shared buffer
    const sharedBuffer = new SharedArrayBuffer(4 * 128);

    // Aggregate import method names
    const importNames: any = { }
    Object.keys(imports).forEach((namespace: string) => {
      importNames[namespace] = Object.keys(imports[namespace]);
    })

    const workerFile = process.env.NODE_ENV === 'production'
      ? 'worker.js'
      : 'worker.import.js';
  
    const worker = new Worker(path.resolve(__dirname, workerFile), {
      workerData: {
        sharedBuffer,
        wasmSource,
        importNames
      }
    });

    this.destroyed = false;

    this._worker = worker;
    this._shared = new Int32Array(sharedBuffer, 0, 128);
    this._calling = false;
    this._head = 0;
    this._callbacks = [];

    worker.on('message', (m) => {
      // Read & Write To / From Buffer
      if (m.type === "buffer") {
        const cb = this._getCallback(m.id);
        const lck = new Int32Array(m.buffer, 0, 1);
        const buf = Buffer.from(m.buffer).slice(4);

        if (cb.buffer) { // is writing
          cb.buffer.copy(buf);
          cb.callback(null, cb.buffer);
        } else { // is reading
          cb.callback(null, buf);
        }

        lck[0] = 1;
        Atomics.notify(lck, 0, Infinity);
        return;
      }

      // Posting the result of a WASM call
      if (m.type === "result") {
        const cb = this._getCallback(m.id);
        cb.callback(null, m.result);
        return;
      }

      // Execute an import method from WASM
      if (m.type === "impcall") {
        // Locate the import being called
        const fn = imports[m.namespace][m.method];

        if (!fn || typeof fn !== 'function') {
          const error = new Error(`HOST: impcall failed to locate import. ${m.namespace}.${m.method}`);
          this.emit("error", error);
          return;
        }

        // Add a callback to the arguments,
        // letting the import function notify us when
        // it's finished executing
        m.args.push((res: number, error?: Error) => {
          // Cache the current head, this is the index
          // the worker is waiting to be notified at
          const head = this._head;

          // TODO: use types for status codes
          // 1 === finished
          this._shared[this._head++] = 1;
          this._shared[this._head++] = error ? -1 : res;
          this._calling = false;
          Atomics.notify(this._shared, head, Infinity);
        });

        // Reset our buffer's head and exec the call
        this._head = 0;
        this._calling = true;
        fn(...m.args);
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
      return process.nextTick(cb, new Error('Worker destroyed'))
    }

    // Get a new callback ID
    const id = this._callbacks.length;

    // Save the callback at callbacks[id]
    this._callbacks.push({
      buffer: null,
      callback: cb
    });

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
      this.call(method, ...args, (error: Error | null, result: number) => {
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
      cb.callback(new Error('Worker destroyed'))
    }
  }

  public readString(pointer: number, cb: Callback) {
    // Don't continue if we're destroying ourselves
    if (this.destroyed) {
      return process.nextTick(cb, new Error('Worker destroyed'))
    }

    // Get a new callback ID
    const id = this._callbacks.length;

    // Save the callback at callbacks[id]
    this._callbacks.push({
      buffer: null,
      callback: cb
    });

    // Post our execution to the worker
    this._worker.postMessage({
      type: 'read-string',
      id,
      pointer
    });
  }

  public async readStringAsync(pointer: number): Promise<{
    error: Error | null,
    result: number
  }> {
    return new Promise((resolve) => {
      this.readString(pointer, (error: Error | null, result: number) => {
        resolve({
          error,
          result
        })
      })
    })
  }

  public writeString(value: string, cb: Callback) {
    // Don't continue if we're destroying ourselves
    if (this.destroyed) {
      return process.nextTick(cb, new Error('Worker destroyed'))
    }

    // Get a new callback ID
    const id = this._callbacks.length;

    // Save the callback at callbacks[id]
    this._callbacks.push({
      buffer: null,
      callback: cb
    });

    // Post our execution to the worker
    this._worker.postMessage({
      type: 'write-string',
      id,
      value
    });
  }

  public async writeStringAsync(value: string): Promise<{
    error: Error | null,
    result: number
  }> {
    return new Promise((resolve) => {
      this.writeString(value, (error: Error | null, result: number) => {
        resolve({
          error,
          result
        })
      })
    })
  }

  // Fetch a callback given its ID
  private _getCallback(id: number) {
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

  // TODO: idk if we need this...
  /*write (pointer: number, buffer: any, cb: any) {
    if (!cb) cb = noop
    if (this.destroyed) return process.nextTick(cb, new Error('Worker destroyed'))

    const id = this._callbacks.length

    this._callbacks.push({
      buffer,
      callback: cb
    })

    if (this._calling) {
      const head = this._head
      this._shared[this._head++] = 3
      this._shared[this._head++] = id
      this._shared[this._head++] = pointer
      this._shared[this._head++] = buffer.length
      Atomics.notify(this._shared, head, Infinity)
    } else {
      this._worker.postMessage({
        type: 'write',
        id,
        pointer,
        length: buffer.length
      })
    }
  }

  // TODO: idk if we need this...
  read (pointer: number, length: any, cb: any) {
    if (this.destroyed) return process.nextTick(cb, new Error('Worker destroyed'))

    const id = this._callbacks.length

    this._callbacks.push({
      buffer: null,
      callback: cb
    })

    if (this._calling) {
      const head = this._head
      this._shared[this._head++] = 2
      this._shared[this._head++] = id
      this._shared[this._head++] = pointer
      this._shared[this._head++] = length
      Atomics.notify(this._shared, head, Infinity)
    } else {
      this._worker.postMessage({
        type: 'read',
        id,
        pointer,
        length
      })
    }
  }*/
}
