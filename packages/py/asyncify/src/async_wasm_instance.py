/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { indexOfArray, isPromise, proxyGet } from "./utils";

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
  private _returnValue: Promise<unknown> | unknown;

  private constructor() {}

  public static createMemory(config: { module: ArrayBuffer }): WasmMemory {
    const bytecode = new Uint8Array(config.module);

    // extract the initial memory page size, as it will
    // throw an error if the imported page size differs:
    // https://chromium.googlesource.com/v8/v8/+/644556e6ed0e6e4fac2dfabb441439820ec59813/src/wasm/module-instantiate.cc#924
    const envMemoryImportSignature = Uint8Array.from([
      // env ; import module name
      0x65,
      0x6e,
      0x76,
      // string length
      0x06,
      // memory ; import field name
      0x6d,
      0x65,
      0x6d,
      0x6f,
      0x72,
      0x79,
      // import kind
      0x02,
      // limits ; https://github.com/sunfishcode/wasm-reference-manual/blob/master/WebAssembly.md#resizable-limits
      // limits ; flags
      // 0x??,
      // limits ; initial
      // 0x__,
    ]);

    const sigIdx = indexOfArray(bytecode, envMemoryImportSignature);

    if (sigIdx < 0) {
      throw Error(
        `Unable to find Wasm memory import section. ` +
          `Modules must import memory from the "env" module's ` +
          `"memory" field like so:\n` +
          `(import "env" "memory" (memory (;0;) #))`
      );
    }

    // Extract the initial memory page-range size
    const memoryInitalLimits =
      bytecode[sigIdx + envMemoryImportSignature.length + 1];

    if (memoryInitalLimits === undefined) {
      throw Error(
        "No initial memory number found, this should never happen..."
      );
    }

    return new WebAssembly.Memory({ initial: memoryInitalLimits });
  }

  public static async createInstance(config: {
    module: ArrayBuffer;
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
