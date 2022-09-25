import { buildWrapper, stopTestEnvironment } from "@polywrap/test-env-js";
import { Uri } from "@polywrap/core-js";
import { PolywrapClient } from "@polywrap/client-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import fs from "fs";
import { getClient } from "./helpers/getClient";

jest.setTimeout(360000);

const simpleWrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple`;
const simpleWrapperUri = new Uri(`fs/${simpleWrapperPath}/build`);

describe("Filesystem plugin", () => {
  let client: PolywrapClient;

  beforeAll(async () => {
    await buildWrapper(simpleWrapperPath);

    client = getClient();
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("invokes simple wrapper on local file system", async () => {
    const result = await client.invoke<string>({
      uri: simpleWrapperUri.uri,
      method: "simpleMethod",
      args: {
        arg: "test",
      },
    });

    expect(result.error).toBeFalsy();
    expect(result.data).toBeTruthy();
    expect(typeof result.data).toBe("string");
    expect(result.data).toEqual("test");

    // get the manifest
    const manifest = await client.getManifest(simpleWrapperUri);

    expect(manifest).toBeTruthy();
    expect(manifest.version).toBe("0.1");
    expect(manifest.type).toEqual("wasm");

    // get a file
    const file = await client.getFile(simpleWrapperUri, {
      path: "wrap.info",
    });

    const expectedFile = await fs.promises.readFile(
      `${simpleWrapperPath}/build/wrap.info`
    );

    const expectedInfo = Uint8Array.from(expectedFile);
    expect(file).toStrictEqual(expectedInfo);
  });
});
