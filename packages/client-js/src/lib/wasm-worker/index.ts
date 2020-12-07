import {ASCImports} from '../types';

import {Worker, MessageChannel, MessagePort} from 'worker_threads';
import {EventEmitter} from 'events';
import path from 'path';

export type WasmCallback = (result: number, error?: Error) => void;
export type MessageCallback = (result: string, error?: Error) => void;

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

export class WasmWorker extends EventEmitter {
  public destroyed: boolean;

  private _worker: Worker;
  private _secondaryPort: MessagePort;
  private _shared: Int32Array;
  private _head: number;
  private _callbacks: (WasmCallback | MessageCallback)[];

  constructor(wasmSource: BufferSource, imports: ASCImports) {
    super();

    // Initialize a shared buffer
    const sharedBuffer = new SharedArrayBuffer(4 * 128);

    // Aggregate import method names
    const importNames: Record<string, string[]> = {};
    Object.keys(imports).forEach((namespace: string) => {
      importNames[namespace] = Object.keys(imports[namespace]);
    });

    const workerFile = process.env.WORKER_ENV === 'test' ? 'worker-import.js' : 'worker.js';

    const worker = new Worker(path.resolve(__dirname, workerFile), {
      workerData: {
        sharedBuffer,
        wasmSource,
        importNames,
      },
    });

    this.destroyed = false;
    this._worker = worker;
    this._shared = new Int32Array(sharedBuffer, 0, 128);
    this._head = 0;
    this._callbacks = [];

    // Stand up a secondary message channel for all
    // secondary actions (reading & writing to WASM for ex)
    const {port1, port2} = new MessageChannel();
    this._secondaryPort = port1;

    worker.on('message', (m) => {
      // Posting the result of a WASM call
      if (m.type === 'result') {
        const cb = this._getCallback(m.id);
        cb(m.result, null);
        return;
      }

      // Execute an import method from WASM
      if (m.type === 'impcall') {
        // Locate the import being called
        const fn = imports[m.namespace][m.method];

        if (!fn || typeof fn !== 'function') {
          const error = new Error(`HOST: impcall failed to locate import. ${m.namespace}.${m.method}`);
          this.emit('error', error);
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
        };
        m.args.push(callback);

        // Reset our buffer's head and exec the call
        this._head = 0;
        fn(...m.args);
        return;
      }

      if (m.type === 'log') {
        console.log(m.log);
        return;
      }

      // If an error occurs within the worker
      if (m.type === 'error') {
        const error = new Error(m.error);
        this.emit('error', error);
        return;
      }
    });

    // Send the other end of the channel to the worker
    worker.postMessage(
      {
        type: 'spawn-sub-port',
        port: port2,
      },
      [port2]
    );

    this._secondaryPort.on('message', (message) => {
      // Posting the result of a secondary action
      if (message.type === 'result') {
        const cb = this._getCallback(message.id);
        cb(message.result, null);
        return;
      }
    });
  }

  // Call a WASM exported method
  public call(method: string, ...args: unknown[]): void {
    // Get the callback appended to the arguments
    // if it exists
    const cb = args.length && typeof args[args.length - 1] === 'function' ? (args.pop() as WasmCallback) : noop;

    // Don't continue if we're destroying ourselves
    if (this.destroyed) {
      return process.nextTick(cb, -1, new Error('Worker destroyed'));
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
      args,
    });
  }

  public async callAsync(
    method: string,
    ...args: unknown[]
  ): Promise<{
    error: Error | null;
    result: number;
  }> {
    if (args.length && typeof args[args.length - 1] === 'function') {
      throw Error('No callback argument supported on Async method, await result.');
    }

    return new Promise((resolve) => {
      this.call(method, ...args, (result: number, error: Error | null) => {
        resolve({
          error,
          result,
        });
      });
    });
  }

  // Destroy this WASM worker
  public destroy(): void {
    this.destroyed = true;
    void this._worker.terminate();

    while (this._callbacks.length) {
      const cb = this._getCallback(this._callbacks.length - 1);
      cb(-1, new Error('Worker destroyed'));
    }
  }

  public readString(pointer: number, cb: MessageCallback): void {
    // Don't continue if we're destroying ourselves
    if (this.destroyed) {
      return process.nextTick(cb, -1, new Error('Worker destroyed'));
    }

    // Get a new callback ID
    const id = this._callbacks.length;

    // Save the callback at callbacks[id]
    this._callbacks.push(cb);

    // Post our execution to the worker
    this._secondaryPort.postMessage({
      type: 'read-string',
      id,
      pointer,
    });
  }

  public async readStringAsync(
    pointer: number
  ): Promise<{
    error: Error | null;
    result: string;
  }> {
    return new Promise((resolve) => {
      this.readString(pointer, (result: string, error?: Error) => {
        resolve({
          error,
          result,
        });
      });
    });
  }

  public writeString(value: string, cb: WasmCallback): void {
    // Don't continue if we're destroying ourselves
    if (this.destroyed) {
      return process.nextTick(cb, -1, new Error('Worker destroyed'));
    }

    // Get a new callback ID
    const id = this._callbacks.length;

    // Save the callback at callbacks[id]
    this._callbacks.push(cb);

    // Post our execution to the worker
    this._secondaryPort.postMessage({
      type: 'write-string',
      id,
      value,
    });
  }

  public async writeStringAsync(
    value: string
  ): Promise<{
    error: Error | null;
    result: number;
  }> {
    return new Promise((resolve) => {
      this.writeString(value, (result: number, error?: Error) => {
        resolve({
          error,
          result,
        });
      });
    });
  }

  // Fetch a callback given its ID
  private _getCallback(id: number): WasmCallback {
    const cb = this._callbacks[id];
    this._callbacks[id] = null;
    while (this._callbacks.length && this._callbacks[this._callbacks.length - 1] === null) {
      this._callbacks.pop();
    }
    return cb as WasmCallback;
  }
}
