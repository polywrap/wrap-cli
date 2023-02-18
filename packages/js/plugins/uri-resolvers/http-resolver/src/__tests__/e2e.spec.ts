import { PolywrapClient } from "@polywrap/client-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { runCLI, providers, deployWrapper } from "@polywrap/test-env-js";
import { DeployManifest } from "@polywrap/polywrap-manifest-types-js";
import { deserializeWrapManifest } from "@polywrap/wrap-manifest-types-js";

import axios from "axios";
import { getClient } from "./helpers/getClient";

jest.setTimeout(300000);

describe("HTTP Plugin", () => {
  let client: PolywrapClient;
  let wrapperHttpUri: string;

  const wrapperName = "test-wrapper";

  beforeAll(async () => {
    const { exitCode, stderr } = await runCLI({
      args: ["infra", "up", "--modules=http", "--verbose"],
    });

    if (exitCode !== 0) {
      throw new Error(`Failed to start test environment: ${stderr}`);
    }
    wrapperHttpUri = `${providers.http}/wrappers/local/${wrapperName}`;

    const wrapperAbsPath = `${GetPathToTestWrappers()}/bigint-type/implementations/as`;
    const jobs: DeployManifest["jobs"] = {
      buildAndDeployWrapperToHttp: {
        steps: [
          {
            name: "httpDeploy",
            package: "http",
            uri: `fs/${wrapperAbsPath}`,
            config: {
              postUrl: wrapperHttpUri,
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
    const { exitCode, stderr } = await runCLI({
      args: ["infra", "down", "--modules=http", "--verbose"],
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
      `${providers.http}/wrappers/local/${wrapperName}/wrap.info`,
      {
        responseType: "arraybuffer",
      }
    );
    const expectedManifest = await deserializeWrapManifest(data);

    const manifest = await result.value.wrapper.getManifest();

    expect(manifest?.name).toBe("bigint-type");
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
      `${providers.http}/wrappers/local/${wrapperName}/wrap.info`,
      {
        responseType: "arraybuffer",
      }
    );
    const expectedManifest = await deserializeWrapManifest(data);

    const manifest = await result.value.wrapper.getManifest();

    expect(manifest?.name).toBe("bigint-type");
    expect(manifest).toEqual(expectedManifest);
  });
});
