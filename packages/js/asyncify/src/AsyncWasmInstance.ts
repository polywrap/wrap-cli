/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */

type MaybeAsync<T> = Promise<T> | T;

function isPromise<T extends unknown>(
  test?: MaybeAsync<T>
): test is Promise<T> {
  return !!test && typeof (test as Promise<T>).then === "function";
}

function proxyGet<T extends Record<string, unknown>>(
  obj: T,
  transform: (value: unknown) => unknown
): T {
  return new Proxy<T>(obj, {
    get: (obj: T, name: string) => transform(obj[name]),
  });
}

type WasmModule = WebAssembly.Module;
type WasmMemory = WebAssembly.Memory;
type WasmExports = WebAssembly.Exports;
type WasmImports = WebAssembly.Imports;
type WasmModuleImports = WebAssembly.ModuleImports;
type WasmImportValue = WebAssembly.ImportValue;
type WasmInstance = WebAssembly.Instance;

interface AsyncifyExports extends WebAssembly.Exports {
  asyncify_start_unwind: (dataAddr: number) => void;
  asyncify_stop_unwind: () => void;
  asyncify_start_rewind: (dataAddr: number) => void;
  asyncify_stop_rewind: () => void;
  asyncify_get_state: () => number;
}

enum AsyncifyState {
  None = 0,
  Unwinding = 1,
  Rewinding = 2,
}

export class AsyncWasmInstance {
  private static _dataAddr = 16;
  private static _dataStart = AsyncWasmInstance._dataAddr + 8;
  private static _dataEnd = 1024;

  private static _requiredExports: string[] = [
    "asyncify_start_unwind",
    "asyncify_stop_unwind",
    "asyncify_start_rewind",
    "asyncify_stop_rewind",
    "asyncify_get_state",
  ];

  private _instance: WasmInstance;
  private _wrappedImports: WasmImports;
  private _wrappedExports: AsyncifyExports;
  private _returnValue: Promise<unknown> | unknown;

  constructor(config: {
    module: WasmModule;
    imports: WasmImports;
    requiredExports?: string[];
  }) {
    // Wrap imports
    this._wrappedImports = this._wrapImports(config.imports);

    // Create Wasm module instance
    this._instance = new WebAssembly.Instance(
      config.module,
      this._wrappedImports
    );

    // Ensure all required exports exist on Wasm module
    const exportKeys = Object.keys(this._instance.exports);
    const missingExports = [
      ...AsyncWasmInstance._requiredExports,
      ...(config.requiredExports || []),
    ].filter((name) => !exportKeys.includes(name));

    if (missingExports.length) {
      throw new Error(
        `Required Wasm exports were not found: ${missingExports.join(", ")}`
      );
    }

    const exports = this._instance.exports as AsyncifyExports;

    // Wrap exports
    this._wrappedExports = this._wrapExports(exports);

    // Initialize Asyncify stack pointers
    const memory = (exports.memory ||
      (config.imports.env && config.imports.env.memory)) as WasmMemory;

    new Int32Array(memory.buffer, AsyncWasmInstance._dataAddr).set([
      AsyncWasmInstance._dataStart,
      AsyncWasmInstance._dataEnd,
    ]);
  }

  get exports(): WasmExports {
    return this._wrappedExports;
  }

  private _getAsyncifyState(): AsyncifyState {
    return this._wrappedExports.asyncify_get_state();
  }

  private _assertNoneState(): void {
    const state = this._getAsyncifyState();
    if (state !== AsyncifyState.None) {
      throw new Error(`Invalid asyncify state ${state}, expected 0.`);
    }
  }

  private _wrapImports(imports: WasmImports): WasmImports {
    return proxyGet(imports, (moduleImports: WasmModuleImports) =>
      this._wrapModuleImports(moduleImports)
    );
  }

  private _wrapModuleImports(imports: WasmModuleImports) {
    return proxyGet(imports, (importValue: WasmImportValue) => {
      if (typeof importValue === "function") {
        return this._wrapImportFn(importValue);
      }
      return importValue;
    });
  }

  private _wrapImportFn(fn: Function) {
    return (...args: unknown[]) => {
      if (this._getAsyncifyState() === AsyncifyState.Rewinding) {
        this._wrappedExports.asyncify_stop_rewind();
        return this._returnValue;
      }
      this._assertNoneState();
      const value = fn(...args);
      if (!isPromise(value)) {
        return value;
      }
      this._wrappedExports.asyncify_start_unwind(AsyncWasmInstance._dataAddr);
      this._returnValue = value;
    };
  }

  private _wrapExports(exports: AsyncifyExports): AsyncifyExports {
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

    return newExports;
  }

  private _wrapExportFn(fn: Function) {
    return async (...args: unknown[]) => {
      this._assertNoneState();

      let result = fn(...args);

      while (this._getAsyncifyState() === AsyncifyState.Unwinding) {
        this._wrappedExports.asyncify_stop_unwind();
        this._returnValue = await this._returnValue;
        this._assertNoneState();
        this._wrappedExports.asyncify_start_rewind(AsyncWasmInstance._dataAddr);
        result = fn();
      }

      this._assertNoneState();

      return result;
    };
  }
}
