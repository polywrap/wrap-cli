import { PolywrapClient } from "@polywrap/client-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { buildAndDeployWrapper, initTestEnvironment, providers, stopTestEnvironment } from "@polywrap/test-env-js";

import { ipfsResolverPlugin } from "..";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";

jest.setTimeout(300000);

describe("IPFS Plugin", () => {
  let client: PolywrapClient;

  let wrapperIpfsCid: string;

  beforeAll(async () => {
    await initTestEnvironment();

    let { ipfsCid } = await buildAndDeployWrapper({
      wrapperAbsPath: `${GetPathToTestWrappers()}/wasm-as/simple-storage`,
      ipfsProvider: providers.ipfs,
      ethereumProvider: providers.ethereum,
      ensName: "cool.wrapper.eth"
    });

    wrapperIpfsCid = ipfsCid;

    client = new PolywrapClient({
      plugins: [
        {
          uri: "wrap://ens/ipfs.polywrap.eth",
          plugin: ipfsPlugin({
            provider: providers.ipfs
          })
        },
        {
          uri: "wrap://ens/ipfs-uri-resolver.polywrap.eth",
          plugin: ipfsResolverPlugin({})
        }
      ]
    });
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("Should successfully resolve a deployed wrapper - e2e", async () => {
    const wrapperUri = `ipfs/${wrapperIpfsCid}`;

    const result = await client.tryResolveUri({ uri: wrapperUri });

    if (!result.ok) {
      fail("Expected response to not be an error");
    }

    if (result.value.type !== "wrapper") {
      fail("Expected response to be a wrapper");
    }

    const manifest = await result.value.wrapper.getManifest({}, client);

    expect(manifest?.name).toBe("SimpleStorage");
  });
});
