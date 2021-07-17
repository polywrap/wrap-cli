import { Asyncify } from "./Asyncify";
import { W3Exports, W3Imports } from "./types";

export class AsyncWasmInstance {
  private _instance: WebAssembly.Instance;
  private _dataAddr = 16;
  private _dataStart = this._dataAddr + 8;
  private _dataEnd = 1024;
  private _wrappedExports = new WeakMap();
  private _asyncify: Asyncify;

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
    this._asyncify = new Asyncify({
      dataAddr: this._dataAddr,
      dataStart: this._dataStart,
      dataEnd: this._dataEnd,
      wrappedExports: this._wrappedExports,
    });

    this._instance = new WebAssembly.Instance(
      config.module,
      this._asyncify.wrapImports(config.imports)
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

    this._asyncify.init(this._instance, config.imports);
  }

  get exports(): W3Exports {
    return this._wrappedExports.get(this._instance.exports);
  }
}
