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

class Asyncify {
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

  getState() {
    return this.exports.asyncify_get_state();
  }

  assertNoneState() {
    const state = this.getState();
    if (state !== State.None) {
      throw new Error(`Invalid async state ${state}, expected 0.`);
    }
  }

  wrapImportFn(fn: (...args: any[]) => any) {
    return (...args: any) => {
      if (this.getState() === State.Rewinding) {
        this.exports.asyncify_stop_rewind();
        return this.value;
      }
      this.assertNoneState();
      const value = fn(...args);
      if (!isPromise(value)) {
        return value;
      }
      this.exports.asyncify_start_unwind(this._config.dataAddr);
      this.value = value;
    };
  }

  wrapModuleImports(module: any) {
    return proxyGet(module, (importVal: any) => {
      if (typeof importVal === "function") {
        return this.wrapImportFn(importVal);
      }
      return importVal;
    });
  }

  wrapImports(imports: W3Imports) {
    if (imports === undefined) return;

    return proxyGet(imports, (moduleImports = {}) =>
      this.wrapModuleImports(moduleImports)
    );
  }

  wrapExportFn(fn: (...args: any[]) => any) {
    let newExport = this._config.wrappedExports.get(fn);

    if (newExport !== undefined) {
      return newExport;
    }

    newExport = async (...args: any) => {
      this.assertNoneState();

      let result = fn(...args);

      while (this.getState() === State.Unwinding) {
        this.exports.asyncify_stop_unwind();
        this.value = await this.value;
        this.assertNoneState();
        this.exports.asyncify_start_rewind(this._config.dataAddr);
        result = fn();
      }

      this.assertNoneState();

      return result;
    };

    this._config.wrappedExports.set(fn, newExport);

    return newExport;
  }

  wrapExports(exports: W3Exports) {
    const newExports = Object.create(null);

    for (const exportName in exports) {
      let value = exports[exportName];
      if (typeof value === "function" && !exportName.startsWith("asyncify_")) {
        value = this.wrapExportFn(value);
      }
      Object.defineProperty(newExports, exportName, {
        enumerable: true,
        value,
      });
    }

    this._config.wrappedExports.set(exports, newExports);

    return newExports;
  }

  init(instance: WebAssembly.Instance, imports: W3Imports) {
    const exports = instance.exports as W3Exports;

    const memory = exports.memory || (imports.env && imports.env.memory);

    new Int32Array(memory.buffer, this._config.dataAddr).set([
      this._config.dataStart,
      this._config.dataEnd,
    ]);

    this.exports = this.wrapExports(exports);
  }
}

export class AsyncWASMInstance {
  private _instance: WebAssembly.Instance;
  private _dataAddr = 16;
  private _dataStart = this._dataAddr + 8;
  private _dataEnd = 1024;
  private _wrappedExports = new WeakMap();

  private _requiredExports = [
    "asyncify_start_unwind",
    "asyncify_stop_unwind",
    "asyncify_start_rewind",
    "asyncify_stop_rewind",
  ];

  constructor(config: {
    module: WebAssembly.Module;
    imports: W3Imports;
    requiredExports?: string[];
  }) {
    const state = new Asyncify({
      dataAddr: this._dataAddr,
      dataStart: this._dataStart,
      dataEnd: this._dataEnd,
      wrappedExports: this._wrappedExports,
    });

    this._instance = new WebAssembly.Instance(
      config.module,
      state.wrapImports(config.imports)
    );

    const exportKeys = Object.keys(this._instance.exports);

    const missingExports = [
      ...this._requiredExports,
      ...(config.requiredExports || []),
    ].filter((name) => !exportKeys.includes(name));

    if (missingExports.length) {
      throw new Error(
        `WasmWeb3Api: Thread aborted execution.\n` +
          `Message: ${`Required exports were not found: ${missingExports.join(
            ", "
          )}`}\n`
      );
    }

    state.init(this._instance, config.imports);
  }

  get exports(): W3Exports {
    return this._wrappedExports.get(this._instance.exports);
  }
}
