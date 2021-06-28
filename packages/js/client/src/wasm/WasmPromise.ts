export class WasmPromise<T> {
  private _result: T;
  private _exports: any;
  private _view: Int32Array;
  private _dataAddr: number;
  private _sleeping = false;

  static create<T>(
    func: (...args: unknown[]) => Promise<T>,
    getRootMethod: () => string,
    args: {
      memory: WebAssembly.Memory,
      module: WebAssembly.Module
    }
  ): (...args: unknown[]) => T {
    const instance = new WasmPromise<T>();
    instance._exports = args.module.exports;
    instance._view = new Int32Array(args.memory.buffer);
    instance._dataAddr = 16;

    return (...args: unknown[]) => {
      instance.saveState();

      func(args)
        .then((result: T) => {
          instance.resumeState(getRootMethod())(result);
        });

      return instance._result;
    }
  };

  private resumeState(rootMethod: string): (resolvedData: T) => void {
    return (resolvedData: T) => {
      this._exports.asyncify_start_rewind(this._dataAddr);
      this._exports[rootMethod]();

      this._result = resolvedData;
    }
  };

  private saveState() {
    if (!this._sleeping) {
      this._view[this._dataAddr >> 2] = this._dataAddr + 8;
      this._view[(this._dataAddr + 4) >> 2] = 1024;

      this._exports.asyncify_start_unwind(this._dataAddr);
      this._sleeping = true;
    } else {
      // We are called as part of a resume/rewind. Stop sleeping.
      console.log("...resume");
      this._exports.asyncify_stop_rewind();
      this._sleeping = false;
    }
  };
}
