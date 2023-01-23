import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { getClient } from "./helpers/getClient";
import { Result, Uri } from "@polywrap/core-js";
import { ResultOk } from "@polywrap/result";
import {
  deployWrapper,
  initTestEnvironment,
  providers,
  stopTestEnvironment,
} from "@polywrap/test-env-js";
import { DeployManifest } from "@polywrap/polywrap-manifest-types-js";

jest.setTimeout(300000);

describe("IPFS Plugin", () => {
  let ipfsResolverUri = "wrap://ens/ipfs-resolver.polywrap.eth";
  let wrapperIpfsCid: string;

  beforeAll(async () => {
    await initTestEnvironment();

    const wrapperAbsPath = `${GetPathToTestWrappers()}/bigint-type/implementations/as`;

    const jobs: DeployManifest["jobs"] = {
      buildAndDeployWrapper: {
        config: {
          provider: providers.ethereum
        },
        steps: [
          {
            name: "ipfsDeploy",
            package: "ipfs",
            uri: `fs/${wrapperAbsPath}`,
            config: {
              gatewayUri: providers.ipfs,
            },
          },
        ],
      },
    };

    const response = await deployWrapper({
      wrapperAbsPath: wrapperAbsPath,
      jobs
    });

    if (!response) {
      throw Error("Failed to deploy wrapper");
    }

    const extractCID = /(wrap:\/\/ipfs\/[A-Za-z0-9]+)/;
    const result = response.stdout.match(extractCID);
    wrapperIpfsCid = new Uri(result![1]).path;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("Should successfully resolve a deployed wrapper - e2e", async () => {
    const client = getClient({});

    const wrapperUri = `ipfs/${wrapperIpfsCid}`;

    const result = await client.tryResolveUri({ uri: wrapperUri });

    if (!result.ok) {
      fail("Expected response to not be an error");
    }

    if (result.value.type !== "wrapper") {
      fail("Expected response to be a wrapper");
    }

    const manifest = await result.value.wrapper.getManifest();

    expect(manifest?.name).toBe("bigint-type");
  });

  const createRacePromise = (
    timeout: number
  ): Promise<Result<Uint8Array, Error>> => {
    return new Promise<Result<Uint8Array, Error>>((resolve) =>
      setTimeout(() => {
        resolve(ResultOk(Uint8Array.from([1, 2, 3, 4])));
      }, timeout)
    );
  };

  it("Should properly timeout - getFile", async () => {
    const runGetFileTimeoutTestWithEnv = async (
      env: Record<string, unknown>,
      timeout: number
    ) => {
      const nonExistentFileCid =
        "Qmaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
      const client = getClient(env);

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

      if (!fasterRaceResult.ok) fail(fasterRaceResult.error);
      const expectedFasterResult = await fasterRacePromise;
      if (!expectedFasterResult.ok) fail(expectedFasterResult.error);
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
        skipCheckIfExists: true,
      },
      timeout
    );
  });

  it("Should properly timeout - tryResolveUri", async () => {
    const runTryResolveUriTimeoutTestWithEnv = async (
      env: Record<string, unknown>,
      timeout: number
    ) => {
      const nonExistentFileCid =
        "Qmaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
      const client = getClient(env);

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

      if (!fasterRaceResult.ok) fail(fasterRaceResult.error);
      const expectedFasterResult = await fasterRacePromise;
      if (!expectedFasterResult.ok) fail(expectedFasterResult.error);
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
