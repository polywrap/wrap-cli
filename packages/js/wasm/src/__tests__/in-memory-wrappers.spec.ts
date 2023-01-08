import { GetPathToTestWrappers } from "@polywrap/test-cases";
import fs from "fs";
import { InMemoryFileReader } from "../InMemoryFileReader";
import { deserializeWrapManifest } from "@polywrap/wrap-manifest-types-js";
import { WasmWrapper } from "../WasmWrapper";
import { Result, ResultErr, ResultOk } from "@polywrap/result";
import { WRAP_MANIFEST_PATH, WRAP_MODULE_PATH } from "../constants";

jest.setTimeout(200000);

const wrapperPath = `${GetPathToTestWrappers()}/subinvoke/00-subinvoke/implementations/as`;

describe("In-memory wrappers", () => {
  it("can create in-memory wrappers from buffers", async () => {
    const manifest = await fs.promises.readFile(
      `${wrapperPath}/${WRAP_MANIFEST_PATH}`
    );
    const wrapManifest = await deserializeWrapManifest(manifest);

    const wasmModule = await fs.promises.readFile(
      `${wrapperPath}/${WRAP_MODULE_PATH}`
    );
    const wrapper = await WasmWrapper.from(manifest, wasmModule);

    expect(wrapper.getManifest()).toEqual(wrapManifest);
    expect(await wrapper.getFile({ path: WRAP_MANIFEST_PATH })).toEqual(
      ResultOk(manifest)
    );
    expect(await wrapper.getFile({ path: WRAP_MODULE_PATH })).toEqual(
      ResultOk(wasmModule)
    );
  });

  it("can create in-memory wrappers from file reader", async () => {
    const manifest = await fs.promises.readFile(
      `${wrapperPath}/${WRAP_MANIFEST_PATH}`
    );
    const wrapManifest = await deserializeWrapManifest(manifest);

    const wasmModule = await fs.promises.readFile(
      `${wrapperPath}/${WRAP_MODULE_PATH}`
    );

    const fileReader = InMemoryFileReader.from(manifest, wasmModule);
    const wrapper = await WasmWrapper.from(fileReader);

    expect(wrapper.getManifest()).toEqual(wrapManifest);
    expect(await wrapper.getFile({ path: WRAP_MANIFEST_PATH })).toEqual(
      ResultOk(manifest)
    );
    expect(await wrapper.getFile({ path: WRAP_MODULE_PATH })).toEqual(
      ResultOk(wasmModule)
    );
  });

  it("can create in-memory wrappers from manifest and file reader", async () => {
    const manifest = await fs.promises.readFile(
      `${wrapperPath}/${WRAP_MANIFEST_PATH}`
    );
    const wrapManifest = await deserializeWrapManifest(manifest);

    const wasmModule = await fs.promises.readFile(
      `${wrapperPath}/${WRAP_MODULE_PATH}`
    );

    const fileReader = InMemoryFileReader.from(manifest, wasmModule);
    const wrapper = await WasmWrapper.from(manifest, fileReader);

    expect(wrapper.getManifest()).toEqual(wrapManifest);
    expect(await wrapper.getFile({ path: WRAP_MANIFEST_PATH })).toEqual(
      ResultOk(manifest)
    );
    expect(await wrapper.getFile({ path: WRAP_MODULE_PATH })).toEqual(
      ResultOk(wasmModule)
    );
  });

  it("can create in-memory wrappers from manifest, wasm module and file reader", async () => {
    const testEncoded = new TextEncoder().encode("test");

    const manifest = await fs.promises.readFile(
      `${wrapperPath}/${WRAP_MANIFEST_PATH}`
    );
    const wrapManifest = await deserializeWrapManifest(manifest);

    const wasmModule = await fs.promises.readFile(
      `${wrapperPath}/${WRAP_MODULE_PATH}`
    );

    const wrapper = await WasmWrapper.from(manifest, wasmModule, {
      readFile: async (path: string): Promise<Result<Uint8Array, Error>> => {
        if (path === "test.txt") {
          return ResultOk(testEncoded);
        } else {
          return ResultErr(Error(`File ${path} not found`));
        }
      },
    });

    expect(await wrapper.getManifest()).toEqual(wrapManifest);
    expect(await wrapper.getFile({ path: WRAP_MANIFEST_PATH })).toEqual(
      ResultOk(manifest)
    );
    expect(await wrapper.getFile({ path: WRAP_MODULE_PATH })).toEqual(
      ResultOk(wasmModule)
    );
    expect(await wrapper.getFile({ path: "test.txt" })).toEqual(
      ResultOk(testEncoded)
    );
  });
});
