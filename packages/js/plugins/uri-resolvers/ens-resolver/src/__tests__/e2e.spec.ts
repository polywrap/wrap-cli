import { PolywrapClient } from "@polywrap/client-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import {
  deployWrapper,
  initTestEnvironment,
  providers,
  ensAddresses,
  stopTestEnvironment,
} from "@polywrap/test-env-js";
import { DeployManifest } from "@polywrap/polywrap-manifest-types-js";

import { getClient } from "./helpers/getClient";

jest.setTimeout(300000);

describe("ENS Resolver Plugin", () => {
  let client: PolywrapClient;
  let wrapperEnsDomain: string;
  const wrapperAbsPath = `${GetPathToTestWrappers()}/bigint-type/implementations/as`;

  beforeAll(async () => {
    await initTestEnvironment();
    wrapperEnsDomain = "cool-wrapper.eth";

    const jobs: DeployManifest["jobs"] = {
      buildAndDeployWrapper: {
        config: {
          provider: providers.ethereum,
          ensRegistryAddress: ensAddresses.ensAddress,
          ensRegistrarAddress: ensAddresses.registrarAddress,
          ensResolverAddress: ensAddresses.resolverAddress,
        },
        steps: [
          {
            name: "registerName",
            package: "ens-recursive-name-register",
            uri: `wrap://ens/${wrapperEnsDomain}`,
          },
          {
            name: "ipfsDeploy",
            package: "ipfs",
            uri: `fs/${wrapperAbsPath}`,
            config: {
              gatewayUri: providers.ipfs,
            },
          },
          {
            name: "ensPublish",
            package: "ens",
            uri: "$$ipfsDeploy",
            config: {
              domainName: wrapperEnsDomain,
            },
          },
        ],
      },
    };

    await deployWrapper({
      wrapperAbsPath,
      jobs
    });

    client = getClient();
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("Should successfully resolve a deployed wrapper - e2e", async () => {
    const wrapperUri = `ens/testnet/${wrapperEnsDomain}`;
    const result = await client.tryResolveUri({ uri: wrapperUri });

    if (!result.ok) {
      throw result.error;
    }

    if (result.value.type !== "package") {
      fail("Expected response to be a package");
    }

    const manifestResult = await result.value.package.getManifest();

    if (!manifestResult.ok) {
      fail(manifestResult.error);
    }

    const manifest = manifestResult.value;

    expect(manifest?.name).toBe("bigint-type");
  });
});
