import { buildWrapper } from "@polywrap/test-env-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import fs from "fs";
import { InMemoryFileReader } from "../InMemoryFileReader";
import { deserializeWrapManifest } from "@polywrap/wrap-manifest-types-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";
import { WRAP_MANIFEST_PATH, WRAP_MODULE_PATH } from "../constants";

jest.setTimeout(200000);

const simpleWrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple`;

describe("In-memory file reader", () => {
  beforeAll(async () => {
    await buildWrapper(simpleWrapperPath);
  });

  it("can create in-memory file reader from buffers", async () => {
    const manifest = await fs.promises.readFile(
      `${simpleWrapperPath}/build/${WRAP_MANIFEST_PATH}`
    );

    const wasmModule = await fs.promises.readFile(
      `${simpleWrapperPath}/build/${WRAP_MODULE_PATH}`
    );
    const fileReader = InMemoryFileReader.from(manifest, wasmModule);

    expect(await fileReader.readFile(WRAP_MANIFEST_PATH)).toEqual(
      ResultOk(manifest)
    );
    expect(await fileReader.readFile(WRAP_MODULE_PATH)).toEqual(
      ResultOk(wasmModule)
    );
  });

  it("can create in-memory file reader from manifest and file reader", async () => {
    const testEncoded = new TextEncoder().encode("test");

    const manifest = await fs.promises.readFile(
      `${simpleWrapperPath}/build/${WRAP_MANIFEST_PATH}`
    );

    const wasmModule = await fs.promises.readFile(
      `${simpleWrapperPath}/build/${WRAP_MODULE_PATH}`
    );

    const fileReader = InMemoryFileReader.fromManifest(manifest, {
      readFile: async (path: string): Promise<Result<Uint8Array, Error>> => {
        if (path === WRAP_MODULE_PATH) {
          return ResultOk(wasmModule);
        } else if (path === "test.txt") {
          return ResultOk(testEncoded);
        } else {
          return ResultErr(Error(`File ${path} not found`));
        }
      },
    });

    expect(await fileReader.readFile(WRAP_MANIFEST_PATH)).toEqual(
      ResultOk(manifest)
    );
    expect(await fileReader.readFile(WRAP_MODULE_PATH)).toEqual(
      ResultOk(wasmModule)
    );
    expect(await fileReader.readFile("test.txt")).toEqual(
      ResultOk(testEncoded)
    );
  });

  it("can create in-memory file reader from wasm module and file reader", async () => {
    const testEncoded = new TextEncoder().encode("test");

    const manifest = await fs.promises.readFile(
      `${simpleWrapperPath}/build/${WRAP_MANIFEST_PATH}`
    );

    const wasmModule = await fs.promises.readFile(
      `${simpleWrapperPath}/build/${WRAP_MODULE_PATH}`
    );

    const fileReader = InMemoryFileReader.fromWasmModule(wasmModule, {
      readFile: async (path: string): Promise<Result<Uint8Array, Error>> => {
        if (path === WRAP_MANIFEST_PATH) {
          return ResultOk(manifest);
        } else if (path === "test.txt") {
          return ResultOk(testEncoded);
        } else {
          return ResultErr(Error(`File ${path} not found`));
        }
      },
    });

    expect(await fileReader.readFile(WRAP_MANIFEST_PATH)).toEqual(
      ResultOk(manifest)
    );
    expect(await fileReader.readFile(WRAP_MODULE_PATH)).toEqual(
      ResultOk(wasmModule)
    );
    expect(await fileReader.readFile("test.txt")).toEqual(
      ResultOk(testEncoded)
    );
  });

  it("can create in-memory file reader from manifest, wasm module and file reader", async () => {
    const testEncoded = new TextEncoder().encode("test");

    const manifest = await fs.promises.readFile(
      `${simpleWrapperPath}/build/${WRAP_MANIFEST_PATH}`
    );

    const wasmModule = await fs.promises.readFile(
      `${simpleWrapperPath}/build/${WRAP_MODULE_PATH}`
    );

    const fileReader = InMemoryFileReader.from(manifest, wasmModule, {
      readFile: async (path: string): Promise<Result<Uint8Array, Error>> => {
        if (path === "test.txt") {
          return ResultOk(testEncoded);
        } else {
          return ResultErr(Error(`File ${path} not found`));
        }
      },
    });

    expect(await fileReader.readFile(WRAP_MANIFEST_PATH)).toEqual(
      ResultOk(manifest)
    );
    expect(await fileReader.readFile(WRAP_MODULE_PATH)).toEqual(
      ResultOk(wasmModule)
    );
    expect(await fileReader.readFile("test.txt")).toEqual(
      ResultOk(testEncoded)
    );
  });
});
