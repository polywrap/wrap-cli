import { fileSystemResolverPlugin } from "../index";
import {
  buildWrapper,
  initTestEnvironment,
  stopTestEnvironment,
  providers,
  ensAddresses,
} from "@polywrap/test-env-js";
import {
  PolywrapClient,
  PolywrapClientConfig,
  defaultIpfsProviders,
} from "@polywrap/client-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import { ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import fs from "fs";
import path from "path";

jest.setTimeout(360000);

describe("Filesystem plugin", () => {
  let client: PolywrapClient;

  beforeAll(async () => {
    await initTestEnvironment();

    const config: Partial<PolywrapClientConfig> = {
      envs: [
        {
          uri: "wrap://ens/ipfs.polywrap.eth",
          env: {
            provider: providers.ipfs,
            fallbackProviders: defaultIpfsProviders,
          },
        },
      ],
      plugins: [
        {
          uri: "wrap://ens/fs-resolver.polywrap.eth",
          plugin: fileSystemResolverPlugin({}),
        },
        {
          uri: "wrap://ens/ipfs.polywrap.eth",
          plugin: ipfsPlugin({}),
        },
        {
          uri: "wrap://ens/ens-resolver.polywrap.eth",
          plugin: ensResolverPlugin({
            addresses: {
              testnet: ensAddresses.ensAddress,
            },
          }),
        },
        {
          uri: "wrap://ens/ethereum.polywrap.eth",
          plugin: ethereumPlugin({
            networks: {
              testnet: {
                provider: providers.ethereum,
              },
            },
            defaultNetwork: "testnet",
          }),
        },
      ],
    };
    client = new PolywrapClient(config);
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("invokes simple-storage wrapper on local drive", async () => {
    const wrapperPath = path.resolve(
      `${GetPathToTestWrappers()}/wasm-as/simple-storage`
    );
    await buildWrapper(wrapperPath);

    const fsPath = `${wrapperPath}/build`;
    const fsUri = `fs/${fsPath}`;

    // invoke wrapper from filesystem
    const deploy = await client.invoke<string>({
      uri: fsUri,
      method: "deployContract",
      args: {
        connection: {
          networkNameOrChainId: "testnet",
        },
      },
    });

    expect(deploy.error).toBeFalsy();
    expect(deploy.data).toBeTruthy();
    expect(deploy.data?.indexOf("0x")).toBeGreaterThan(-1);

    // get the schema
    const schema = await client.getSchema(fsUri);
    const expectedSchema = await fs.promises.readFile(
      `${fsPath}/schema.graphql`,
      "utf-8"
    );

    expect(schema).toBe(expectedSchema);

    // get the manifest
    const manifest = await client.getManifest(fsUri, {});

    expect(manifest).toBeTruthy();
    expect(manifest.version).toBe("0.1");
    expect(manifest.type).toEqual("wasm");

    // get a file
    const file = await client.getFile(fsUri, {
      path: "wrap.info",
    });

    const expectedFile = await fs.promises.readFile(`${fsPath}/wrap.info`);

    const expectedInfo = Uint8Array.from(expectedFile);
    expect(file).toStrictEqual(expectedInfo);
  });
});
