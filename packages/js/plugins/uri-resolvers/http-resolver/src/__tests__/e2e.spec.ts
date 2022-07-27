import { PolywrapClient } from "@polywrap/client-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { buildWrapper, initTestEnvironment, stopTestEnvironment, runCLI } from "@polywrap/test-env-js";

import { httpPlugin } from "@polywrap/http-plugin-js";
import { httpResolverPlugin } from "..";

jest.setTimeout(300000);

describe("IPFS Plugin", () => {
  let client: PolywrapClient;

  let wrapperIpfsCid: string;

  beforeAll(async () => {
    await initTestEnvironment();
    await buildWrapper(`${GetPathToTestWrappers()}/wasm-as/simple-storage`);
    await runCLI()

    wrapperIpfsCid = ipfsCid;

    client = new PolywrapClient({
      plugins: [
        {
          uri: "wrap://ens/http.polywrap.eth",
          plugin: httpPlugin({})
        },
        {
          uri: "wrap://ens/http-uri-resolver.polywrap.eth",
          plugin: httpResolverPlugin({})
        }
      ]
    });
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("Should successfully resolve a deployed wrapper - e2e", async () => {
    const wrapperUri = `ipfs/${wrapperIpfsCid}`;

    const resolution = await client.resolveUri(wrapperUri);

    expect(resolution.wrapper).toBeTruthy();

    const expectedSchema = (
      await ipfs.cat(`${wrapperIpfsCid}/schema.graphql`)
    ).toString("utf-8");

    const schema = await resolution.wrapper?.getSchema(client);

    expect(schema).toEqual(expectedSchema);

    const info = await resolution.wrapper?.getManifest({}, client);
    expect(info?.name).toBe("SimpleStorage");
  });
});
