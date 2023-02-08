import { PolywrapClient } from "@polywrap/client-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { Commands, ETH_ENS_IPFS_MODULE_CONSTANTS } from "@polywrap/cli-js";
import { DeployManifest } from "@polywrap/polywrap-manifest-types-js";
import fs from "fs";
import path from "path";
import yaml from "yaml";

import { getClient } from "./helpers/getClient";
jest.setTimeout(300000);

describe("ENS Resolver Plugin", () => {
  let client: PolywrapClient = getClient();
  let wrapperEnsDomain = "test-wrapper.eth";

  const wrapperAbsPath = `${GetPathToTestWrappers()}/wasm-as/simple-storage`;

  beforeAll(async () => {
    await Commands.infra("up", {
      modules: ["eth-ens-ipfs"],
    });

    await Commands.build({ codegen: true }, { cwd: wrapperAbsPath })
    const tempDeployManifestName = "polywrap.deploy-temp.yaml";
    const tempDeployManifestPath = path.join(
      wrapperAbsPath,
      tempDeployManifestName
    );
    const tempDeployManifest: Omit<DeployManifest, "__type"> = {
      format: '0.2.0',
      jobs: {
        deployToEns: {
          config: {
            provider: ETH_ENS_IPFS_MODULE_CONSTANTS.ethereumProvider,
            ensRegistryAddress: ETH_ENS_IPFS_MODULE_CONSTANTS.ensAddresses.ensAddress,
            ensRegistrarAddress: ETH_ENS_IPFS_MODULE_CONSTANTS.ensAddresses.registrarAddress,
            ensResolverAddress: ETH_ENS_IPFS_MODULE_CONSTANTS.ensAddresses.resolverAddress,
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
              uri: `fs/${wrapperAbsPath}/build`,
              config: {
                gatewayUri: ETH_ENS_IPFS_MODULE_CONSTANTS.ipfsProvider
              }
            },
            {
              name: "ensPublish",
              package: "ens",
              uri: "$$ipfsDeploy",
              config: {
                domainName: wrapperEnsDomain,
              },
            },
          ]
        }
      }
    }
    fs.writeFileSync(
      tempDeployManifestPath,
      yaml.stringify(tempDeployManifest, null, 2)
    );
    await Commands.deploy({
      manifestFile: tempDeployManifestPath,
    }, {
      cwd: wrapperAbsPath
    });
    // remove manually configured manifests
    fs.unlinkSync(tempDeployManifestPath);
  });

  afterAll(async () => {
    await Commands.infra("down", {
      modules: ["eth-ens-ipfs"],
    });
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

    const manifest = await result.value.wrapper.getManifest();

    expect(manifest?.name).toBe("SimpleStorage");
  });
});
