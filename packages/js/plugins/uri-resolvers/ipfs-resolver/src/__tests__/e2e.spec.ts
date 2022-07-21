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

    const resolution = await client.resolveUri(wrapperUri);

    expect(resolution.wrapper).toBeTruthy();

    const info = await resolution.wrapper?.getManifest(client);
    expect(info?.name).toBe("SimpleStorage");
  });
});
