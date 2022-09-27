import { buildWrapper } from "@polywrap/test-env-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import fs from "fs";
import { WasmPackage } from "../WasmPackage";
import { InMemoryFileReader } from "../InMemoryFileReader";
import { deserializeWrapManifest } from "@polywrap/wrap-manifest-types-js";
import { ResultErr, ResultOk } from "@polywrap/result";

jest.setTimeout(200000);

const simpleWrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple`;

describe("In-memory packages", () => {
  beforeAll(async () => {
    await buildWrapper(simpleWrapperPath);
  });

  it("can create in-memory packages from buffers", async () => {
    const manifest = await fs.promises.readFile(
      `${simpleWrapperPath}/build/wrap.info`
    );
    const wrapManifest = await deserializeWrapManifest(manifest);

    const wasmModule = await fs.promises.readFile(
      `${simpleWrapperPath}/build/wrap.wasm`
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
    expect(await wrapper.getFile({ path: "wrap.info" })).toEqual(
      ResultOk(manifest)
    );
    expect(await wrapper.getFile({ path: "wrap.wasm" })).toEqual(
      ResultOk(wasmModule)
    );
  });

  it("can create in-memory packages from file reader", async () => {
    const manifest = await fs.promises.readFile(
      `${simpleWrapperPath}/build/wrap.info`
    );
    const wrapManifest = await deserializeWrapManifest(manifest);

    const wasmModule = await fs.promises.readFile(
      `${simpleWrapperPath}/build/wrap.wasm`
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
    expect(await wrapper.getFile({ path: "wrap.info" })).toEqual(
      ResultOk(manifest)
    );
    expect(await wrapper.getFile({ path: "wrap.wasm" })).toEqual(
      ResultOk(wasmModule)
    );
  });

  it("can create in-memory packages from manifest and file reader", async () => {
    const manifest = await fs.promises.readFile(
      `${simpleWrapperPath}/build/wrap.info`
    );
    const wrapManifest = await deserializeWrapManifest(manifest);

    const wasmModule = await fs.promises.readFile(
      `${simpleWrapperPath}/build/wrap.wasm`
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
    expect(await wrapper.getFile({ path: "wrap.info" })).toEqual(
      ResultOk(manifest)
    );
    expect(await wrapper.getFile({ path: "wrap.wasm" })).toEqual(
      ResultOk(wasmModule)
    );
  });

  it("can create in-memory packages from manifest, wasm module and file reader", async () => {
    const testEncoded = new TextEncoder().encode("test");

    const manifest = await fs.promises.readFile(
      `${simpleWrapperPath}/build/wrap.info`
    );
    const wrapManifest = await deserializeWrapManifest(manifest);

    const wasmModule = await fs.promises.readFile(
      `${simpleWrapperPath}/build/wrap.wasm`
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
    expect(await wrapper.getFile({ path: "wrap.info" })).toEqual(
      ResultOk(manifest)
    );
    expect(await wrapper.getFile({ path: "wrap.wasm" })).toEqual(
      ResultOk(wasmModule)
    );
    expect(await wrapper.getFile({ path: "test.txt" })).toEqual(
      ResultOk(testEncoded)
    );
  });
});
