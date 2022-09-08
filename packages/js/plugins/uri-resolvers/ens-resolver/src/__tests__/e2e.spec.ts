import { PolywrapClient } from "@polywrap/client-js";
import { defaultIpfsProviders } from "@polywrap/client-config-builder-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import {
  buildAndDeployWrapper,
  ensAddresses,
  initTestEnvironment,
  providers,
  stopTestEnvironment
} from "@polywrap/test-env-js";

import { ensResolverPlugin } from "..";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ethereumPlugin, Connections, Connection } from "@polywrap/ethereum-plugin-js";

jest.setTimeout(300000);

describe("ENS Resolver Plugin", () => {
  let client: PolywrapClient;
  let wrapperEnsDomain: string;

  const wrapperAbsPath = `${GetPathToTestWrappers()}/wasm-as/simple-storage`;

  beforeAll(async () => {
    await initTestEnvironment();

    let { ensDomain } = await buildAndDeployWrapper({
      wrapperAbsPath: wrapperAbsPath,
      ipfsProvider: providers.ipfs,
      ethereumProvider: providers.ethereum,
      ensName: "cool.wrapper.eth"
    });

    wrapperEnsDomain = ensDomain;

    client = new PolywrapClient({
      plugins: [
        {
          uri: "wrap://ens/ipfs.polywrap.eth",
          plugin: ipfsPlugin({
            provider: providers.ipfs,
            fallbackProviders: defaultIpfsProviders
          })
        },
        {
          uri: "wrap://ens/ethereum.polywrap.eth",
          plugin: ethereumPlugin({
            connections: new Connections({
              networks: {
                testnet: new Connection({
                  provider: providers.ethereum
                }),
              },
              defaultNetwork: "testnet"
            })
          })
        },
        {
          uri: "wrap://ens/ens-resolver.polywrap.eth",
          plugin: ensResolverPlugin({
            addresses: {
              testnet: ensAddresses.ensAddress
            }
          })
        }
      ]
    });
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("Should successfully resolve a deployed wrapper - e2e", async () => {
    const wrapperUri = `ens/testnet/${wrapperEnsDomain}`;
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
