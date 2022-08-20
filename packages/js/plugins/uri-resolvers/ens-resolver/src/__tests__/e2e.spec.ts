import { defaultIpfsProviders, PolywrapClient } from "@polywrap/client-js";
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
import { ethereumPlugin } from "@polywrap/ethereum-plugin-js";

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
            networks: {
              testnet: {
                provider: providers.ethereum
              },
              goerli: {
                provider:
                  "https://goerli.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
              },
            },
            defaultNetwork: "testnet"
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
    const resolution = await client.resolveUri(wrapperUri);

    expect(resolution.error).toBeFalsy();
    expect(resolution.wrapper).toBeTruthy();

    const manifest = await resolution.wrapper?.getManifest(
      {},
      client
    );

    expect(manifest?.name).toBe("SimpleStorage");
  });
});
