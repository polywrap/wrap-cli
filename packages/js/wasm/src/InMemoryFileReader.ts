import { WRAP_MANIFEST_PATH, WRAP_MODULE_PATH } from "./constants";
import { IFileReader } from "./IFileReader";

import { Result, ResultErr, ResultOk } from "@polywrap/result";

export class InMemoryFileReader {
  static fromManifest(
    manifest: Uint8Array,
    baseFileReader: IFileReader
  ): IFileReader {
    return {
      async readFile(filePath: string): Promise<Result<Uint8Array, Error>> {
        if (filePath === WRAP_MANIFEST_PATH) {
          return ResultOk(manifest);
        } else {
          return baseFileReader.readFile(filePath);
        }
      },
    } as IFileReader;
  }

  static fromWasmModule(
    wasmModule: Uint8Array,
    baseFileReader: IFileReader
  ): IFileReader {
    return {
      async readFile(filePath: string): Promise<Result<Uint8Array, Error>> {
        if (filePath === WRAP_MODULE_PATH) {
          return ResultOk(wasmModule);
        } else {
          return baseFileReader.readFile(filePath);
        }
      },
    };
  }
  static from(
    manifest: Uint8Array,
    wasmModule: Uint8Array,
    baseFileReader?: IFileReader
  ): IFileReader {
    return {
      async readFile(filePath: string): Promise<Result<Uint8Array, Error>> {
        if (filePath === WRAP_MANIFEST_PATH) {
          return ResultOk(manifest);
        } else if (filePath === WRAP_MODULE_PATH) {
          return ResultOk(wasmModule);
        } else if (baseFileReader) {
          return baseFileReader.readFile(filePath);
        } else {
          return ResultErr(Error(`File not found at ${filePath}.`));
        }
      },
    };
  }
}
