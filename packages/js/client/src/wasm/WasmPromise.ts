import { W3Exports } from "./types";

/* eslint-disable @typescript-eslint/naming-convention */
export class WasmPromise<T> {
  private _result: T;
  private _exports: { values: W3Exports };
  private _view: Int32Array;
  private _dataAddr: number;
  private _sleeping = false;

  static create<T>(
    func: (...args: unknown[]) => Promise<T>,
    getRootCall: () => { method: string, args: unknown[] },
    config: {
      memory: WebAssembly.Memory;
      exports: { values: W3Exports };
    }
  ): (...args: unknown[]) => T {
    const instance = new WasmPromise<T>();
    instance._exports = config.exports;
    instance._view = new Int32Array(config.memory.buffer);
    instance._dataAddr = 16;

    return (...args: unknown[]) => {
      instance.execAsyncFunc(() => {
        console.log("executing")
        func(...args).then((result: T) => {
          const rootCall = getRootCall();
          instance.resumeState(rootCall.method, rootCall.args)(result);
        });
      });

      return instance._result;
    };
  }

  private resumeState(rootMethod: string, rootArgs: unknown[]): (resolvedData: T) => void {
    return (resolvedData: T) => {
      console.log("start_rewind");
      this._exports.values.asyncify_start_rewind(this._dataAddr);
      console.log("calling root method");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this._exports.values as any)[rootMethod](...rootArgs);

      this._result = resolvedData;
    };
  }

  private execAsyncFunc(exec: () => void) {
    if (!this._sleeping) {
      this._view[this._dataAddr >> 2] = this._dataAddr + 8;
      this._view[(this._dataAddr + 4) >> 2] = 1024;

      console.log("start_unwind")
      this._exports.values.asyncify_start_unwind(this._dataAddr);
      this._sleeping = true;
      exec();
    } else {
      console.log("stop_rewind")
      this._exports.values.asyncify_stop_rewind();
      this._sleeping = false;
    }
  }
}
