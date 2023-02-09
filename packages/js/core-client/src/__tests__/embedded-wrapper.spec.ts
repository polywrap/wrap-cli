import fs from "fs";
import path from "path";
import { buildWrapper } from "@polywrap/test-env-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { UriResolver } from "@polywrap/uri-resolvers-js";
import { WasmWrapper, InMemoryFileReader } from "@polywrap/wasm-js";
import { Uri, Wrapper } from "@polywrap/core-js";
import { PolywrapCoreClient } from "../PolywrapCoreClient";
import { Result, ResultErr, ResultOk } from "@polywrap/result";

jest.setTimeout(200000);

const simpleWrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple`;
const simpleWrapperUri = new Uri(`fs/${simpleWrapperPath}/build`);

describe("Embedded wrapper", () => {
  beforeAll(async () => {
    await buildWrapper(simpleWrapperPath);
  });

  it("can invoke an embedded wrapper", async () => {
    const manifestBuffer = fs.readFileSync(path.join(simpleWrapperPath, "build/wrap.info"))
    const wasmModuleBuffer = fs.readFileSync(path.join(simpleWrapperPath, "build/wrap.wasm"))

    let wrapper: Wrapper = await WasmWrapper.from(manifestBuffer, wasmModuleBuffer);

    const client = new PolywrapCoreClient({
      resolver: UriResolver.from([
        {
          uri: simpleWrapperUri,
          wrapper
        }
      ])
    });

    const result = await client.invoke<string>({
      uri: simpleWrapperUri,
      method: "simpleMethod",
      args: {
        arg: "test",
      },
    });

    if (!result.ok) fail(result.error);
    expect(result.value).toBeTruthy();
    expect(typeof result.value).toBe("string");
    expect(result.value).toEqual("test");
  });

  it("can get a file from wrapper", async () => {
    const manifestBuffer = fs.readFileSync(path.join(simpleWrapperPath, "build/wrap.info"))
    const wasmModuleBuffer = fs.readFileSync(path.join(simpleWrapperPath, "build/wrap.wasm"))
    const testFilePath = "hello.txt";
    const testFileText = "Hello Test!";

    const wrapper = await WasmWrapper.from(manifestBuffer, wasmModuleBuffer, {
      readFile: async (filePath): Promise<Result<Uint8Array, Error>> => {
        if (filePath === testFilePath) {
            return ResultOk(Buffer.from(testFileText, "utf-8"));
        } else {
            return ResultErr(new Error(`File not found: ${filePath}`));
        }
      }
    });

    await testEmbeddedWrapperWithFile(wrapper, testFilePath, testFileText);
  });

  it("can add embedded wrapper through file reader", async () => {
    const manifestBuffer = fs.readFileSync(path.join(simpleWrapperPath, "build/wrap.info"))
    const wasmModuleBuffer = fs.readFileSync(path.join(simpleWrapperPath, "build/wrap.wasm"))
    const testFilePath = "hello.txt";
    const testFileText = "Hello Test!";

    const wrapper = await WasmWrapper.from({
      readFile: async (filePath): Promise<Result<Uint8Array, Error>> => {
        if (filePath === testFilePath) {
            return ResultOk(Buffer.from(testFileText, "utf-8"));
        } else if (filePath === "wrap.info") {
          return ResultOk(manifestBuffer);
        } else if (filePath === "wrap.wasm") {
          return ResultOk(wasmModuleBuffer);
        } else {
          return ResultErr(new Error(`File not found: ${filePath}`));
        }
      }
    });

    await testEmbeddedWrapperWithFile(wrapper, testFilePath, testFileText);
  });

  it("can add embedded wrapper with async wrap manifest", async () => {
    const manifestBuffer = fs.readFileSync(path.join(simpleWrapperPath, "build/wrap.info"))
    const wasmModuleBuffer = fs.readFileSync(path.join(simpleWrapperPath, "build/wrap.wasm"))
    const testFilePath = "hello.txt";
    const testFileText = "Hello Test!";

    const wrapper = await WasmWrapper.from(
      InMemoryFileReader.fromWasmModule(wasmModuleBuffer, {
        readFile: async (filePath): Promise<Result<Uint8Array, Error>> => {
          if (filePath === testFilePath) {
              return ResultOk(Buffer.from(testFileText, "utf-8"));
          } else if (filePath === "wrap.info") {
            return ResultOk(manifestBuffer);
          } else {
            return ResultErr(new Error(`File not found: ${filePath}`));
          }
        }
      })
    );

    await testEmbeddedWrapperWithFile(wrapper, testFilePath, testFileText);
  });

  it("can add embedded wrapper with async wasm module", async () => {
    const manifestBuffer = fs.readFileSync(path.join(simpleWrapperPath, "build/wrap.info"))
    const wasmModuleBuffer = fs.readFileSync(path.join(simpleWrapperPath, "build/wrap.wasm"))
    const testFilePath = "hello.txt";
    const testFileText = "Hello Test!";

    const wrapper = await WasmWrapper.from(manifestBuffer, {
      readFile: async (filePath): Promise<Result<Uint8Array, Error>> => {
        if (filePath === testFilePath) {
            return ResultOk(Buffer.from(testFileText, "utf-8"));
        } else if (filePath === "wrap.wasm") {
          return ResultOk(wasmModuleBuffer);
        } else {
          return ResultErr(new Error(`File not found: ${filePath}`));
        }
      }
    });

    await testEmbeddedWrapperWithFile(wrapper, testFilePath, testFileText);
  });
});

const testEmbeddedWrapperWithFile = async (wrapper: WasmWrapper, filePath: string, fileText: string) => {
  const client = new PolywrapCoreClient({
    resolver: UriResolver.from([
      {
        uri: simpleWrapperUri,
        wrapper
      }
    ])
  });

  const expectedManifest = 
    await fs.promises.readFile(`${simpleWrapperPath}/build/wrap.info`);
  const receivedManifestResult = await client.getFile(simpleWrapperUri, {
    path: "wrap.info",
  });
  if (!receivedManifestResult.ok) fail(receivedManifestResult.error);
  const receivedManifest = receivedManifestResult.value as Uint8Array;
  expect(receivedManifest).toEqual(expectedManifest);

  const expectedWasmModule = 
    await fs.promises.readFile(`${simpleWrapperPath}/build/wrap.wasm`);
  const receivedWasmModuleResult = await client.getFile(simpleWrapperUri, {
    path: "wrap.wasm",
  });
  if (!receivedWasmModuleResult.ok) fail(receivedWasmModuleResult.error);
  const receivedWasmModule = receivedWasmModuleResult.value as Uint8Array;
  expect(receivedWasmModule).toEqual(expectedWasmModule);

  const receivedHelloFileResult = await client.getFile(simpleWrapperUri, {
      path: filePath,
      encoding: "utf-8",
    });
  if (!receivedHelloFileResult.ok) fail(receivedHelloFileResult.error);
  const receivedHelloFile = receivedHelloFileResult.value as Uint8Array;

  expect(receivedHelloFile).toEqual(fileText);
};
