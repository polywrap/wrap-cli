/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { isPromise, proxyGet } from "./utils";

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
  public static requiredExports: readonly string[] = [
    "asyncify_start_unwind",
    "asyncify_stop_unwind",
    "asyncify_start_rewind",
    "asyncify_stop_rewind",
    "asyncify_get_state",
  ];

  private static _dataAddr = 16;
  private static _dataStart = AsyncWasmInstance._dataAddr + 8;
  private static _dataEnd = 1024;

  private _instance: WasmInstance;
  private _wrappedImports: WasmImports;
  private _wrappedExports: AsyncifyExports;
  private _importFnResult: Promise<unknown> | unknown;

  private constructor() {}

  public static async createInstance(config: {
    module: Uint8Array;
    imports: WasmImports;
    requiredExports?: readonly string[];
  }): Promise<AsyncWasmInstance> {
    const instance = new AsyncWasmInstance();
    // Wrap imports
    instance._wrappedImports = instance._wrapImports(config.imports);

    // Create Wasm module instance
    instance._instance = (
      await WebAssembly.instantiate(config.module, instance._wrappedImports)
    ).instance;

    // Ensure all required exports exist on Wasm module
    const exportKeys = Object.keys(instance._instance.exports);
    const missingExports = [
      ...AsyncWasmInstance.requiredExports,
      ...(config.requiredExports || []),
    ].filter((name) => !exportKeys.includes(name));

    if (missingExports.length) {
      throw new Error(
        `Required Wasm exports were not found: ${missingExports.join(", ")}`
      );
    }

    const exports = instance._instance.exports as AsyncifyExports;

    // Wrap exports
    instance._wrappedExports = instance._wrapExports(exports);

    // Initialize Asyncify stack pointers
    const memory = (exports.memory ||
      (config.imports.env && config.imports.env.memory)) as WasmMemory;

    new Int32Array(memory.buffer, AsyncWasmInstance._dataAddr).set([
      AsyncWasmInstance._dataStart,
      AsyncWasmInstance._dataEnd,
    ]);
    return instance;
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
    return proxyGet(
      imports,
      (moduleImports: WasmModuleImports | undefined, name: string) => {
        if (moduleImports === undefined) {
          throw Error(
            `Unsupported wasm import namespace requested: "${name}"; ` +
              `Supported wasm import namespaces: ${Object.keys(imports)
                .map((x) => `"${x}"`)
                .join(", ")}`
          );
        }
        return this._wrapModuleImports(moduleImports);
      }
    );
  }

  private _wrapModuleImports(imports: WasmModuleImports) {
    return proxyGet(
      imports,
      (importValue: WasmImportValue | undefined, name: string) => {
        if (importValue === undefined) {
          throw Error(
            `Unsupported wasm import requested: "${name}"; ` +
              `Supported wasm imports: ${Object.keys(imports)
                .map((x) => `"${x}"`)
                .join(", ")}`
          );
        }
        if (typeof importValue === "function") {
          return this._wrapImportFn(importValue);
        }
        return importValue;
      }
    );
  }

  private _wrapImportFn(importFn: Function) {
    return (...args: unknown[]) => {
      if (this._getAsyncifyState() === AsyncifyState.Rewinding) {
        this._wrappedExports.asyncify_stop_rewind();
        return this._importFnResult;
      }
      this._assertNoneState();
      const value = importFn(...args);
      if (!isPromise(value)) {
        return value;
      }
      this._wrappedExports.asyncify_start_unwind(AsyncWasmInstance._dataAddr);
      this._importFnResult = value;
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

  private _wrapExportFn(exportFn: Function) {
    return async (...args: unknown[]) => {
      this._assertNoneState();

      let result = exportFn(...args);

      while (this._getAsyncifyState() === AsyncifyState.Unwinding) {
        this._wrappedExports.asyncify_stop_unwind();
        this._importFnResult = await this._importFnResult;
        this._assertNoneState();
        this._wrappedExports.asyncify_start_rewind(AsyncWasmInstance._dataAddr);
        result = exportFn();
      }

      this._assertNoneState();

      return result;
    };
  }
}
