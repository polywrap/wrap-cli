import { Uri } from "@polywrap/core-js";
import { PolywrapClient } from "@polywrap/client-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import fs from "fs";
import { getClient } from "./helpers/getClient";

jest.setTimeout(360000);

const simpleWrapperPath = `${GetPathToTestWrappers()}/subinvoke/00-subinvoke/implementations/as`;
const simpleWrapperUri = new Uri(`fs/${simpleWrapperPath}`);

describe("Filesystem plugin", () => {
  let client: PolywrapClient = getClient();

  it("invokes simple wrapper on local file system", async () => {
    const result = await client.invoke<number>({
      uri: simpleWrapperUri.uri,
      method: "add",
      args: {
        "a": 1,
        "b": 1
      },
    });

    if (!result.ok) {
      console.log(result.error);
      fail("Expected response to not be an error");
    }

    expect(result.value).toEqual(2);

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
      `${simpleWrapperPath}/wrap.info`
    );

    const expectedInfo = Uint8Array.from(expectedFile);
    expect(file.value).toStrictEqual(expectedInfo);
  });
});
