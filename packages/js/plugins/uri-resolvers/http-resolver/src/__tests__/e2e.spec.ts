import { PolywrapClient } from "@polywrap/client-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { buildAndDeployWrapperToHttp } from "@polywrap/test-env-js";

import { httpPlugin } from "@polywrap/http-plugin-js";
import { httpResolverPlugin } from "..";

jest.setTimeout(300000);

describe("HTTP Plugin", () => {
  let client: PolywrapClient;
  let wrapperHttpUri: string;

  beforeAll(async () => {
    // const { exitCode, stderr } = await runCLI({
    //   args: ["infra", "up", "--modules=http", "--verbose"]
    // });

    // if (exitCode !== 0) {
    //   throw new Error(`Failed to start test environment: ${stderr}`);
    // }

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
    // const { exitCode, stderr } = await runCLI({
    //   args: ["infra", "down", "--modules=http", "--verbose"]
    // });

    // if (exitCode !== 0) {
    //   throw new Error(`Failed to stop test environment: ${stderr}`);
    // }
  });

  it("Should successfully resolve a deployed wrapper - e2e", async () => {
    const wrapperUri = `http/${wrapperHttpUri}`;
    // const { data, error } = await client.invoke({
    //   uri: "wrap://ens/http-uri-resolver.polywrap.eth",
    //   args: {
    //     authority: "http",
    //     path: `http://localhost:3500/wrappers/local/test-wrapper`
    //   },
    //   method: "tryResolveUri"
    // })

    const resolution = await client.resolveUri(wrapperUri);

    console.log(JSON.stringify(resolution.uriHistory, null, 2));

    expect(resolution.wrapper).toBeTruthy();
  });
});
