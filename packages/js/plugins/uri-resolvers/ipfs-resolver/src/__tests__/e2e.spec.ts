import { PolywrapClient } from "@polywrap/client-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import {
  buildAndDeployWrapper,
  initTestEnvironment,
  providers,
  stopTestEnvironment,
} from "@polywrap/test-env-js";

import { ipfsResolverPlugin } from "..";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { IpfsClient } from "./helpers/IpfsClient";
import { createIpfsClient } from "./helpers/createIpfsClient";
import { InvokeResult } from "@polywrap/core-js";

jest.setTimeout(300000);

describe("IPFS Resolver Plugin", () => {
  let ipfsResolverUri = "wrap://ens/ipfs-resolver.polywrap.eth";
  let ipfs: IpfsClient;

  let wrapperIpfsCid: string;

  const getClientConfigWithIpfsResolverEnv = (env: Record<string, unknown>) => {
    return {
      plugins: [
        {
          uri: "wrap://ens/ipfs.polywrap.eth",
          plugin: ipfsPlugin({}),
        },
        {
          uri: ipfsResolverUri,
          plugin: ipfsResolverPlugin({}),
        },
      ],
      envs: [
        {
          uri: "wrap://ens/ipfs.polywrap.eth",
          env: {
            provider: providers.ipfs,
          },
        },
        {
          uri: "wrap://ens/ipfs-resolver.polywrap.eth",
          env: env,
        },
      ],
    };
  };

  beforeAll(async () => {
    await initTestEnvironment();

    ipfs = createIpfsClient(providers.ipfs);

    let { ipfsCid } = await buildAndDeployWrapper({
      wrapperAbsPath: `${GetPathToTestWrappers()}/wasm-as/simple-storage`,
      ipfsProvider: providers.ipfs,
      ethereumProvider: providers.ethereum,
      ensName: "cool.wrapper.eth",
    });

    wrapperIpfsCid = ipfsCid;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("Should successfully resolve a deployed wrapper - e2e", async () => {
    const client = new PolywrapClient(getClientConfigWithIpfsResolverEnv({}));

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

  const createRacePromise = (
    timeout: number
  ): Promise<InvokeResult<Uint8Array>> => {
    return new Promise<InvokeResult<Uint8Array>>((resolve) =>
      setTimeout(() => {
        resolve({
          data: Uint8Array.from([1, 2, 3, 4]),
          error: undefined,
        });
      }, timeout)
    );
  };

  it("Should properly timeout - getFile", async () => {
    const runGetFileTimeoutTestWithEnv = async (
      env: Record<string, unknown>,
      timeout: number
    ) => {
      const nonExistentFileCid = "Qmaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
      const client = new PolywrapClient(getClientConfigWithIpfsResolverEnv(env));
  
      const getFilePromise = client.invoke<Uint8Array>({
        uri: ipfsResolverUri,
        method: "getFile",
        args: {
          path: nonExistentFileCid,
        },
      });
  
      const fasterRacePromise = createRacePromise(timeout - 100);
      const slowerRacePromise = createRacePromise(timeout + 100);
  
      const fasterRaceResult = await Promise.race([
        fasterRacePromise,
        getFilePromise,
      ]);
      const slowerRaceResult = await Promise.race([
        getFilePromise,
        slowerRacePromise,
      ]);
  
      expect(fasterRaceResult.data).toStrictEqual((await fasterRacePromise).data);
      expect(slowerRaceResult.data).toStrictEqual((await getFilePromise).data);
    };

    const timeout = 1000;

    await runGetFileTimeoutTestWithEnv(
      {
        timeouts: {
          getFile: timeout,
          checkIfExists: timeout,
          tryResolveUri: timeout,
        },
      },
      timeout
    );

    await runGetFileTimeoutTestWithEnv(
      {
        timeouts: {
          getFile: timeout,
          checkIfExists: timeout,
          tryResolveUri: timeout,
        },
        skipCheckIfExistsBeforeGetFile: true
      },
      timeout
    );
  });

  it("Should properly timeout - tryResolveUri", async () => {
    const runTryResolveUriTimeoutTestWithEnv = async (
      env: Record<string, unknown>,
      timeout: number
    ) => {
      const nonExistentFileCid = "Qmaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
      const client = new PolywrapClient(getClientConfigWithIpfsResolverEnv(env));
  
      const getFilePromise = client.invoke<Uint8Array>({
        uri: ipfsResolverUri,
        method: "tryResolveUri",
        args: {
          authority: "ipfs",
          path: nonExistentFileCid,
        },
      });
  
      const fasterRacePromise = createRacePromise(timeout - 100);
      const slowerRacePromise = createRacePromise(timeout + 100);
  
      const fasterRaceResult = await Promise.race([
        fasterRacePromise,
        getFilePromise,
      ]);
      const slowerRaceResult = await Promise.race([
        getFilePromise,
        slowerRacePromise,
      ]);
  
      expect(fasterRaceResult.data).toStrictEqual((await fasterRacePromise).data);
      expect(slowerRaceResult.data).toStrictEqual((await getFilePromise).data);
    };

    const timeout = 1000;

    await runTryResolveUriTimeoutTestWithEnv(
      {
        timeouts: {
          getFile: timeout,
          checkIfExists: timeout,
          tryResolveUri: timeout,
        },
      },
      timeout
    );
  });
});
