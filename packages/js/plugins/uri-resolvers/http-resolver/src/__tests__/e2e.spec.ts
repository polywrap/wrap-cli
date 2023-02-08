import { PolywrapClient } from "@polywrap/client-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { Commands, HTTP_MODULE_CONSTANTS } from "@polywrap/cli-js";
import { deserializeWrapManifest } from "@polywrap/wrap-manifest-types-js";
import { getClient } from "./helpers/getClient";
import { DeployManifest } from "@polywrap/polywrap-manifest-types-js";
import yaml from "yaml";
import path from "path";
import axios from "axios";
import fs from "fs";

jest.setTimeout(300000);

describe("HTTP Plugin", () => {
  let client: PolywrapClient;
  let wrapperHttpUri: string;

  const wrapperName = "test-wrapper";

  beforeAll(async () => {
    const { exitCode , stderr } = await Commands.infra("up", {
      modules: ["http"],
    });

    if (exitCode !== 0) {
      throw new Error(`Failed to start test environment: ${stderr}`);
    }

    const wrapperAbsPath = `${GetPathToTestWrappers()}/wasm-as/simple-storage`;
    await Commands.build({
      codegen: true
    }, {
      cwd: wrapperAbsPath
    })

    const tempDeployManifestName = "polywrap.deploy-temp.yaml";
    const tempDeployManifestPath = path.join(
      wrapperAbsPath,
      tempDeployManifestName
    );
    wrapperHttpUri = `${HTTP_MODULE_CONSTANTS.httpProvider}/wrappers/local/${wrapperName}`;

    const tempDeployManifest: Omit<DeployManifest, "__type"> = {
      format: '0.2.0',
      jobs: {
        deployToHttp: {
          steps: [
            {
              name: "httpDeploy",
              package: "http",
              uri: `fs/${wrapperAbsPath}/build`,
              config: {
                postUrl: wrapperHttpUri,
              },
            }
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
    client = getClient();
  });

  afterAll(async () => {
    const { exitCode , stderr } = await Commands.infra("down", {
      modules: ["http"],
    });

    if (exitCode !== 0) {
      throw new Error(`Failed to stop test environment: ${stderr}`);
    }
  });

  it("Should successfully resolve a deployed wrapper with http authority - e2e", async () => {
    const wrapperUri = `http/${wrapperHttpUri}`;

    const result = await client.tryResolveUri({ uri: wrapperUri });

    if (!result.ok) {
      fail("Expected response to not be an error");
    }

    if (result.value.type !== "wrapper") {
      fail("Expected response to be a wrapper");
    }

    const { data } = await axios.get(
      `${HTTP_MODULE_CONSTANTS.httpProvider}/wrappers/local/${wrapperName}/wrap.info`,
      {
        responseType: "arraybuffer",
      }
    );
    const expectedManifest = await deserializeWrapManifest(data);

    const manifest = await result.value.wrapper.getManifest();

    expect(manifest?.name).toBe("SimpleStorage");
    expect(manifest).toEqual(expectedManifest);
  });

  it("Should successfully resolve a deployed wrapper with https authority - e2e", async () => {
    const wrapperUri = `https/${wrapperHttpUri}`;

    const result = await client.tryResolveUri({ uri: wrapperUri });

    if (!result.ok) {
      fail("Expected response to not be an error");
    }

    if (result.value.type !== "wrapper") {
      fail("Expected response to be a wrapper");
    }

    const { data } = await axios.get(
      `${HTTP_MODULE_CONSTANTS.httpProvider}/wrappers/local/${wrapperName}/wrap.info`,
      {
        responseType: "arraybuffer",
      }
    );
    const expectedManifest = await deserializeWrapManifest(data);

    const manifest = await result.value.wrapper.getManifest();

    expect(manifest?.name).toBe("SimpleStorage");
    expect(manifest).toEqual(expectedManifest);
  });
});
