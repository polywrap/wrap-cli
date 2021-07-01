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
    getRootMethod: () => string,
    args: {
      memory: WebAssembly.Memory;
      exports: { values: W3Exports };
    }
  ): (...args: unknown[]) => T {
    const instance = new WasmPromise<T>();
    instance._exports = args.exports;
    instance._view = new Int32Array(args.memory.buffer);
    instance._dataAddr = 16;
    console.log("CREATED");

    return (...args: unknown[]) => {
      console.log("HEY: ", Object.keys(instance._exports).join(" - "));
      console.log("\n\n\n\n");

      instance.saveState();

      void func(args).then((result: T) => {
        instance.resumeState(getRootMethod())(result);
      });

      return instance._result;
    };
  }

  private resumeState(rootMethod: string): (resolvedData: T) => void {
    return (resolvedData: T) => {
      this._exports.values.asyncify_start_rewind(this._dataAddr);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this._exports.values as any)[rootMethod]();

      this._result = resolvedData;
    };
  }

  private saveState() {
    if (!this._sleeping) {
      this._view[this._dataAddr >> 2] = this._dataAddr + 8;
      this._view[(this._dataAddr + 4) >> 2] = 1024;

      this._exports.values.asyncify_start_unwind(this._dataAddr);
      this._sleeping = true;
    } else {
      this._exports.values.asyncify_stop_rewind();
      this._sleeping = false;
    }
  }
}
