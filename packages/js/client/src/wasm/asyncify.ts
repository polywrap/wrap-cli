/* eslint-disable @typescript-eslint/ban-ts-comment */
import { W3Exports, W3Imports } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
const DATA_ADDR = 16;
const DATA_START = DATA_ADDR + 8;
const DATA_END = 1024;

const WRAPPED_EXPORTS = new WeakMap();

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
  transform: { (value: any): any; (moduleImports?: any): any; (arg0: any): any }
) {
  return new Proxy(obj, {
    get: (obj, name) => transform(obj[name]),
  });
}

class Asyncify {
  exports: W3Exports;
  value: any;

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
      this.exports.asyncify_start_unwind(DATA_ADDR);
      this.value = value;
    };
  }

  wrapModuleImports(module: any) {
    return proxyGet(module, (value: any) => {
      if (typeof value === "function") {
        return this.wrapImportFn(value);
      }
      return value;
    });
  }

  wrapImports(imports: W3Imports) {
    if (imports === undefined) return;

    return proxyGet(imports, (moduleImports = Object.create(null)) =>
      this.wrapModuleImports(moduleImports)
    );
  }

  wrapExportFn(fn: (...args: any[]) => any) {
    let newExport = WRAPPED_EXPORTS.get(fn);

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
        this.exports.asyncify_start_rewind(DATA_ADDR);
        result = fn();
      }

      this.assertNoneState();

      return result;
    };

    WRAPPED_EXPORTS.set(fn, newExport);

    return newExport;
  }

  wrapExports(exports: W3Exports) {
    const newExports = Object.create(null);

    for (const exportName in exports) {
      let value = exports[exportName];
      console.log(exportName, " ", typeof value);
      if (typeof value === "function" && !exportName.startsWith("asyncify_")) {
        value = this.wrapExportFn(value);
      }
      Object.defineProperty(newExports, exportName, {
        enumerable: true,
        value,
      });
    }

    WRAPPED_EXPORTS.set(exports, newExports);

    return newExports;
  }

  init(instance: WebAssembly.Instance, imports: W3Imports) {
    const exports = instance.exports as W3Exports;

    const memory = exports.memory || (imports.env && imports.env.memory);

    new Int32Array(memory.buffer, DATA_ADDR).set([DATA_START, DATA_END]);

    this.exports = this.wrapExports(exports);

    Object.setPrototypeOf(instance, Instance.prototype);
  }
}

export class Instance extends WebAssembly.Instance {
  constructor(module: WebAssembly.Module, imports: W3Imports) {
    const state = new Asyncify();
    super(module, state.wrapImports(imports));
    state.init(this, imports);
  }

  get exports(): W3Exports {
    //@ts-ignore
    return WRAPPED_EXPORTS.get(super.exports);
  }
}

export async function instantiate(
  source: WebAssembly.Module,
  imports: W3Imports
): Promise<{ instance: WebAssembly.Instance; exports: any }> {
  const state = new Asyncify();
  const result = ((await WebAssembly.instantiate(
    source,
    state.wrapImports(imports)
  )) as any).instance;

  const beforeExports = result.exports;

  state.init(result, imports);

  return { instance: result, exports: WRAPPED_EXPORTS.get(beforeExports) };
}
