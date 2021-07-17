/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { W3Exports, W3Imports } from "./types";

enum State {
  None = 0,
  Unwinding = 1,
  Rewinding = 2,
}

function isPromise(obj: any) {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof obj.then === "function"
  );
}

function proxyGet(
  obj: any,
  transform: {
    (value: any): any;
    (moduleImports?: WebAssembly.Imports): any;
    (arg0: any): any;
  }
) {
  return new Proxy(obj, {
    get: (obj, name) => transform(obj[name]),
  });
}

export class Asyncify {
  exports: W3Exports;
  value: any;

  constructor(
    private _config: {
      dataAddr: number;
      dataStart: number;
      dataEnd: number;
      wrappedExports: WeakMap<object, any>;
    }
  ) {}

  init(instance: WebAssembly.Instance, imports: W3Imports) {
    const exports = instance.exports as W3Exports;

    const memory = exports.memory || (imports.env && imports.env.memory);

    new Int32Array(memory.buffer, this._config.dataAddr).set([
      this._config.dataStart,
      this._config.dataEnd,
    ]);

    this.exports = this._wrapExports(exports);
  }

  wrapImports(imports: W3Imports) {
    if (imports === undefined) return;

    return proxyGet(imports, (moduleImports = {}) =>
      this._wrapModuleImports(moduleImports)
    );
  }

  private _getState() {
    return this.exports.asyncify_get_state();
  }

  private _assertNoneState() {
    const state = this._getState();
    if (state !== State.None) {
      throw new Error(`Invalid async state ${state}, expected 0.`);
    }
  }

  private _wrapImportFn(fn: (...args: any[]) => any) {
    return (...args: any) => {
      if (this._getState() === State.Rewinding) {
        this.exports.asyncify_stop_rewind();
        return this.value;
      }
      this._assertNoneState();
      const value = fn(...args);
      if (!isPromise(value)) {
        return value;
      }
      this.exports.asyncify_start_unwind(this._config.dataAddr);
      this.value = value;
    };
  }

  private _wrapModuleImports(module: any) {
    return proxyGet(module, (importVal: any) => {
      if (typeof importVal === "function") {
        return this._wrapImportFn(importVal);
      }
      return importVal;
    });
  }

  private _wrapExportFn(fn: (...args: any[]) => any) {
    let newExport = this._config.wrappedExports.get(fn);

    if (newExport !== undefined) {
      return newExport;
    }

    newExport = async (...args: any) => {
      this._assertNoneState();

      let result = fn(...args);

      while (this._getState() === State.Unwinding) {
        this.exports.asyncify_stop_unwind();
        this.value = await this.value;
        this._assertNoneState();
        this.exports.asyncify_start_rewind(this._config.dataAddr);
        result = fn();
      }

      this._assertNoneState();

      return result;
    };

    this._config.wrappedExports.set(fn, newExport);

    return newExport;
  }

  private _wrapExports(exports: W3Exports) {
    const newExports = Object.create(null);

    for (const exportName in exports) {
      let value = exports[exportName];
      if (typeof value === "function" && !exportName.startsWith("asyncify_")) {
        value = this._wrapExportFn(value);
      }
      Object.defineProperty(newExports, exportName, {
        enumerable: true,
        value,
      });
    }

    this._config.wrappedExports.set(exports, newExports);

    return newExports;
  }
}
