import { buildWrapper, stopTestEnvironment } from "@polywrap/test-env-js";
import { Uri } from "@polywrap/core-js";
import { PolywrapClient } from "@polywrap/client-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import fs from "fs";
import { getClient } from "./helpers/getClient";

jest.setTimeout(360000);

const simpleWrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple`;
const simpleWrapperUri = new Uri(`fs/${simpleWrapperPath}/build`);

describe("Filesystem Resolver plugin", () => {
  let client: PolywrapClient;

  beforeAll(async () => {
    await buildWrapper(simpleWrapperPath, undefined, true);

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

    if (!result.ok) {
      console.log(result.error);
      fail("Expected response to not be an error");
    }

    expect(result.value).toEqual("test");

    // get the manifest
    const manifest = await client.getManifest(simpleWrapperUri);

    if (!manifest.ok) fail(manifest.error);
    expect(manifest.value.version).toBe("0.1");
    expect(manifest.value.type).toEqual("wasm");

    // get a file
    const file = await client.getFile(simpleWrapperUri, {
      path: "wrap.info",
    });
    if (!file.ok) fail(file.error);

    const expectedFile = await fs.promises.readFile(
      `${simpleWrapperPath}/build/wrap.info`
    );

    const expectedInfo = Uint8Array.from(expectedFile);
    expect(file.value).toStrictEqual(expectedInfo);
  });
});
