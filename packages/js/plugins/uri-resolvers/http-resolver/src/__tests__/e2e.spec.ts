import { PolywrapClient } from "@polywrap/client-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { buildAndDeployWrapperToHttp, runCLI } from "@polywrap/test-env-js";

import { httpPlugin } from "@polywrap/http-plugin-js";
import axios from "axios";
import { httpResolverPlugin } from "..";

jest.setTimeout(300000);

describe("HTTP Plugin", () => {
  let client: PolywrapClient;
  let wrapperHttpUri: string;

  beforeAll(async () => {
    const { exitCode, stderr } = await runCLI({
      args: ["infra", "up", "--modules=http", "--verbose"]
    });

    if (exitCode !== 0) {
      throw new Error(`Failed to start test environment: ${stderr}`);
    }

    const { uri } = await buildAndDeployWrapperToHttp({
      wrapperAbsPath: `${GetPathToTestWrappers()}/wasm-as/simple-storage`,
      name: "test-wrapper",
      httpProvider: "http://localhost:3500",
    });

    wrapperHttpUri = uri;

    client = new PolywrapClient({
      plugins: [
        {
          uri: "wrap://ens/http.polywrap.eth",
          plugin: httpPlugin({})
        },
        {
          uri: "wrap://ens/http-uri-resolver.polywrap.eth",
          plugin: httpResolverPlugin({})
        }
      ],
    });
  });

  afterAll(async () => {
    const { exitCode, stderr } = await runCLI({
      args: ["infra", "down", "--modules=http", "--verbose"]
    });

    if (exitCode !== 0) {
      throw new Error(`Failed to stop test environment: ${stderr}`);
    }
  });

  it("Should successfully resolve a deployed wrapper - e2e", async () => {
    const wrapperUri = `http/${wrapperHttpUri}`;

    const resolution = await client.resolveUri(wrapperUri);

    expect(resolution.wrapper).toBeTruthy();
    
    const { data } = await axios.get(`http://localhost:3500/wrappers/local/test-wrapper/schema.graphql`, {
      responseType: "arraybuffer"
    })

    const expectedSchema = Buffer.from(data, "binary").toString("utf8");

    const schema = await resolution.wrapper?.getSchema(client);

    expect(schema).toEqual(expectedSchema);

    const info = await resolution.wrapper?.getManifest({}, client);
    expect(info?.name).toBe("SimpleStorage");
  });
});
