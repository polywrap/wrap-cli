import { GetPathToTestWrappers } from "@polywrap/test-cases";
import fs from "fs";
import { WasmPackage } from "../WasmPackage";
import { InMemoryFileReader } from "../InMemoryFileReader";
import { deserializeWrapManifest } from "@polywrap/wrap-manifest-types-js";
import { ResultErr, ResultOk } from "@polywrap/result";
import { WRAP_MANIFEST_PATH, WRAP_MODULE_PATH } from "../constants";

jest.setTimeout(200000);

const wrapperPath = `${GetPathToTestWrappers()}/subinvoke/00-subinvoke/implementations/as`;

describe("In-memory packages", () => {
  it("can create in-memory packages from buffers", async () => {
    const manifest = await fs.promises.readFile(
      `${wrapperPath}/${WRAP_MANIFEST_PATH}`
    );
    const wrapManifest = await deserializeWrapManifest(manifest);

    const wasmModule = await fs.promises.readFile(
      `${wrapperPath}/${WRAP_MODULE_PATH}`
    );
    const wasmPackage = WasmPackage.from(manifest, wasmModule);

    expect(await wasmPackage.getManifest()).toEqual(ResultOk(wrapManifest));
    expect(await wasmPackage.getWasmModule()).toEqual(ResultOk(wasmModule));

    const wrapperResult = await wasmPackage.createWrapper();

    if (!wrapperResult.ok) {
      throw wrapperResult.error;
    }

    const wrapper = wrapperResult.value;

    expect(wrapManifest).toEqual(wrapper.getManifest());
    expect(await wrapper.getFile({ path: WRAP_MANIFEST_PATH })).toEqual(
      ResultOk(manifest)
    );
    expect(await wrapper.getFile({ path: WRAP_MODULE_PATH })).toEqual(
      ResultOk(wasmModule)
    );
  });

  it("can create in-memory packages from file reader", async () => {
    const manifest = await fs.promises.readFile(
      `${wrapperPath}/${WRAP_MANIFEST_PATH}`
    );
    const wrapManifest = await deserializeWrapManifest(manifest);

    const wasmModule = await fs.promises.readFile(
      `${wrapperPath}/${WRAP_MODULE_PATH}`
    );

    const fileReader = InMemoryFileReader.from(manifest, wasmModule);
    const wasmPackage = WasmPackage.from(fileReader);

    expect(await wasmPackage.getManifest()).toEqual(ResultOk(wrapManifest));
    expect(await wasmPackage.getWasmModule()).toEqual(ResultOk(wasmModule));

    const wrapperResult = await wasmPackage.createWrapper();

    if (!wrapperResult.ok) {
      throw wrapperResult.error;
    }

    const wrapper = wrapperResult.value;

    expect(wrapManifest).toEqual(wrapper.getManifest());
    expect(await wrapper.getFile({ path: WRAP_MANIFEST_PATH })).toEqual(
      ResultOk(manifest)
    );
    expect(await wrapper.getFile({ path: WRAP_MODULE_PATH })).toEqual(
      ResultOk(wasmModule)
    );
  });

  it("can create in-memory packages from manifest and file reader", async () => {
    const manifest = await fs.promises.readFile(
      `${wrapperPath}/${WRAP_MANIFEST_PATH}`
    );
    const wrapManifest = await deserializeWrapManifest(manifest);

    const wasmModule = await fs.promises.readFile(
      `${wrapperPath}/${WRAP_MODULE_PATH}`
    );

    const fileReader = InMemoryFileReader.from(manifest, wasmModule);
    const wasmPackage = WasmPackage.from(manifest, fileReader);

    expect(await wasmPackage.getManifest()).toEqual(ResultOk(wrapManifest));
    expect(await wasmPackage.getWasmModule()).toEqual(ResultOk(wasmModule));

    const wrapperResult = await wasmPackage.createWrapper();

    if (!wrapperResult.ok) {
      throw wrapperResult.error;
    }

    const wrapper = wrapperResult.value;

    expect(wrapManifest).toEqual(wrapper.getManifest());
    expect(await wrapper.getFile({ path: WRAP_MANIFEST_PATH })).toEqual(
      ResultOk(manifest)
    );
    expect(await wrapper.getFile({ path: WRAP_MODULE_PATH })).toEqual(
      ResultOk(wasmModule)
    );
  });

  it("can create in-memory packages from manifest, wasm module and file reader", async () => {
    const testEncoded = new TextEncoder().encode("test");

    const manifest = await fs.promises.readFile(
      `${wrapperPath}/${WRAP_MANIFEST_PATH}`
    );
    const wrapManifest = await deserializeWrapManifest(manifest);

    const wasmModule = await fs.promises.readFile(
      `${wrapperPath}/${WRAP_MODULE_PATH}`
    );

    const wasmPackage = WasmPackage.from(manifest, wasmModule, {
      readFile: async (path: string) => {
        if (path === "test.txt") {
          return ResultOk(testEncoded);
        } else {
          return ResultErr(Error(`File ${path} not found`));
        }
      },
    });

    expect(await wasmPackage.getManifest()).toEqual(ResultOk(wrapManifest));
    expect(await wasmPackage.getWasmModule()).toEqual(ResultOk(wasmModule));

    const wrapperResult = await wasmPackage.createWrapper();

    if (!wrapperResult.ok) {
      throw wrapperResult.error;
    }

    const wrapper = wrapperResult.value;

    expect(wrapManifest).toEqual(wrapper.getManifest());
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
