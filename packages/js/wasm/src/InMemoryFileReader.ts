import { WRAP_MANIFEST_PATH, WRAP_MODULE_PATH } from "./constants";
import { IFileReader } from "./IFileReader";

export class InMemoryFileReader {
  static fromManifest(
    manifest: Uint8Array,
    baseFileReader: IFileReader
  ): IFileReader {
    return {
      async readFile(filePath: string): Promise<Uint8Array | undefined> {
        if (filePath === WRAP_MANIFEST_PATH) {
          return manifest;
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
      async readFile(filePath: string): Promise<Uint8Array | undefined> {
        if (filePath === WRAP_MODULE_PATH) {
          return wasmModule;
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
      async readFile(filePath: string): Promise<Uint8Array | undefined> {
        if (filePath === WRAP_MANIFEST_PATH) {
          return manifest;
        } else if (filePath === WRAP_MODULE_PATH) {
          return wasmModule;
        } else if (baseFileReader) {
          return baseFileReader.readFile(filePath);
        } else {
          return undefined;
        }
      },
    };
  }
}
