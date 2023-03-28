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
import { Result } from "@polywrap/core-js";
import { ResultOk } from "@polywrap/result";
import { UriResolver_MaybeUriOrManifest } from "../wrap";

jest.setTimeout(300000);

describe("IPFS Plugin", () => {
  let ipfsResolverUri = "wrap://ens/ipfs-resolver.polywrap.eth";

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

    const result = await client.tryResolveUri({ uri: wrapperUri });

    if (!result.ok) {
      fail("Expected response to not be an error");
    }

    if (result.value.type !== "wrapper") {
      fail("Expected response to be a wrapper");
    }

    const manifest = await result.value.wrapper.getManifest({});

    expect(manifest?.name).toBe("SimpleStorage");
  });

  const createRacePromise = <TResult>(
    timeout: number,
    result: TResult
  ): Promise<Result<TResult, Error>> => {
    return new Promise<Result<TResult, Error>>((resolve) =>
      setTimeout(() => {
        resolve(ResultOk(result));
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

      const fasterRacePromise = createRacePromise(timeout - 100, null);
      const slowerRacePromise = createRacePromise(timeout + 100, null);

      const fasterRaceResult = await Promise.race([
        fasterRacePromise,
        getFilePromise,
      ]);
      const slowerRaceResult = await Promise.race([
        getFilePromise,
        slowerRacePromise,
      ]);

      if (!fasterRaceResult.ok) fail(fasterRaceResult.error);
      const expectedFasterResult = await fasterRacePromise;
      if (!expectedFasterResult.ok) fail(expectedFasterResult.error)
      expect(fasterRaceResult.value).toStrictEqual(expectedFasterResult.value);

      if (!slowerRaceResult.ok) fail(slowerRaceResult.error);
      const expectedSlowerResult = await getFilePromise;
      if (!expectedSlowerResult.ok) fail(expectedSlowerResult.error);
      expect(slowerRaceResult.value).toStrictEqual(expectedSlowerResult.value);
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
        skipCheckIfExists: true
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

      const getFilePromise = client.invoke<UriResolver_MaybeUriOrManifest>({
        uri: ipfsResolverUri,
        method: "tryResolveUri",
        args: {
          authority: "ipfs",
          path: nonExistentFileCid,
        },
      });

      const expectedResult: UriResolver_MaybeUriOrManifest = {
        manifest: null,
        uri: null
      };

      const fasterRacePromise = createRacePromise(timeout - 100, expectedResult);
      const slowerRacePromise = createRacePromise(timeout + 100, expectedResult);

      const fasterRaceResult = await Promise.race([
        fasterRacePromise,
        getFilePromise,
      ]);
      const slowerRaceResult = await Promise.race([
        getFilePromise,
        slowerRacePromise,
      ]);

      if (!fasterRaceResult.ok) fail(fasterRaceResult.error);
      const expectedFasterResult = await fasterRacePromise;
      if (!expectedFasterResult.ok) fail(expectedFasterResult.error)
      expect(fasterRaceResult.value).toStrictEqual(expectedFasterResult.value);

      if (!slowerRaceResult.ok) fail(slowerRaceResult.error);
      const expectedSlowerResult = await getFilePromise;
      if (!expectedSlowerResult.ok) fail(expectedSlowerResult.error);
      expect(slowerRaceResult.value).toStrictEqual(expectedSlowerResult.value);
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
