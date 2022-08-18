import { clearStyle, polywrapCli } from "./utils";

import { 
  initTestEnvironment,
  runCLI,
  stopTestEnvironment,
  ensAddresses,
  providers
} from "@polywrap/test-env-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import { PolywrapClient } from "@polywrap/client-js";
import { ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import { Wallet } from "@ethersproject/wallet";
import path from "path";
import fs from "fs";
import yaml from "js-yaml";

const HELP = `Usage: polywrap deploy|d [options]

Deploys/Publishes a Polywrap

Options:
  -m, --manifest-file <path>  Path to the Polywrap Deploy manifest file
                              (default: polywrap.yaml | polywrap.yml)
  -o, --output-file <path>    Output file path for the deploy result
  -v, --verbose               Verbose output (default: false)
  -h, --help                  display help for command
`;

const testCaseRoot = path.join(GetPathToCliTestFiles(), "wasm/deploy");
  const testCases =
    fs.readdirSync(testCaseRoot, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  const getTestCaseDir = (index: number) =>
    path.join(testCaseRoot, testCases[index]);

const setup = async (domainNames: string[]) => {
  await stopTestEnvironment();
  await initTestEnvironment();

  // Wait a little longer just in case
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const ensAddress = ensAddresses.ensAddress
  const resolverAddress = ensAddresses.resolverAddress
  const registrarAddress = ensAddresses.registrarAddress
  const signer = new Wallet("0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d");

  // Setup environment variables
  process.env = {
    ...process.env,
    DOMAIN_NAME: "test1.eth",
    ENS_REG_ADDR: ensAddress
  };

  const ethereumPluginUri = "wrap://ens/ethereum.polywrap.eth"
  const client = new PolywrapClient({
    plugins: [
      {
        uri: ethereumPluginUri,
        plugin: ethereumPlugin({
          networks: {
            testnet: {
              provider: providers.ethereum,
              signer
            }
          },
          defaultNetwork: "testnet"
        }),
      }
    ],
  });

  const ensWrapperUri = `fs/${path.join(
    path.dirname(require.resolve("@polywrap/test-env-js")),
    "wrappers", "ens"
  )}`;

  for await (const domainName of domainNames) {
    const result = await client.invoke({
      uri: ensWrapperUri,
      method: "registerDomainAndSubdomainsRecursively",
      args: {
        domain: domainName,
        owner: signer.address,
        registrarAddress,
        registryAddress: ensAddress,
        resolverAddress,
        ttl: "0",
        connection: {
          networkNameOrChainId: "testnet",
        },
      },
    });

    if (result.error) {
      throw Error(
        `Failed to register ${domainName}: ${result.error.message}`
      );
    }
  }
}

describe("e2e tests for deploy command", () => {
  beforeAll(async () => {
    await setup(["test1.eth", "test2.eth", "test3.eth"])

    for (let i = 0; i < testCases.length; ++i) {
      await runCLI(
        {
          args: ["build", "-v"],
          cwd: getTestCaseDir(i),
          cli: polywrapCli,
        },
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["deploy", "--help"],
        cwd: getTestCaseDir(0),
        cli: polywrapCli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  it("Should deploy the project successfully", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["deploy"],
        cwd: getTestCaseDir(0),
        cli: polywrapCli,
        env: process.env as Record<string, string>
      },
    );

    const sanitizedOutput = clearStyle(output);

    expect(error).toBeFalsy();
    expect(code).toEqual(0);
    expect(sanitizedOutput).toContain(
      "Successfully executed stage 'ipfs_deploy'"
    );
    expect(sanitizedOutput).toContain(
      "Successfully executed stage 'from_deploy'"
    );
  });

  it("Should output the results to a file if -o is passed", async () => {
    await runCLI(
      {
        args: ["deploy", "-o", "./output.yaml"],
        cwd: getTestCaseDir(0),
        cli: polywrapCli,
        env: process.env as Record<string, string>
      },
    );

    await runCLI(
      {
        args: ["deploy", "-o", "./output.json"],
        cwd: getTestCaseDir(0),
        cli: polywrapCli,
        env: process.env as Record<string, string>
      },
    );
    
    const yamlOutputFileContents = JSON.parse(
      JSON.stringify(
        (yaml.load(
          fs.readFileSync(
            path.join(getTestCaseDir(0), "output.yaml"),
            "utf8"
          )
        ) as unknown) as Array<unknown>
      )
    )

    const jsonOutputFileContents = JSON.parse(
      fs.readFileSync(
        path.join(getTestCaseDir(0), "output.json"),
        "utf8"
      )
    )

    fs.unlinkSync(path.join(getTestCaseDir(0), "output.yaml"))
    fs.unlinkSync(path.join(getTestCaseDir(0), "output.json"))

    expect(yamlOutputFileContents).toMatchObject(jsonOutputFileContents);
    expect(jsonOutputFileContents).toMatchObject([
      {
        id: "ipfs_deploy",
        name: "ipfs_deploy",
        input: {
          uri: "wrap://fs/./build"
        },
        result: "wrap://ipfs/QmT5nBb8xwrfZnmFNRZexmrebzaaxW7CPfh1ZznQ6zsVaG"
      },
      {
        id: "ipfs_deploy.from_deploy",
        name: "from_deploy",
        input: {
          uri: "wrap://ipfs/QmT5nBb8xwrfZnmFNRZexmrebzaaxW7CPfh1ZznQ6zsVaG",
          config: {
            domainName: "test1.eth",
            provider: "http://localhost:8545",
            ensRegistryAddress: "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab"
          }
        },
        result: "wrap://ens/test1.eth"
      },
      {
        id: "ipfs_deploy.from_deploy2",
        name: "from_deploy2",
        input: {
          uri: "wrap://ipfs/QmT5nBb8xwrfZnmFNRZexmrebzaaxW7CPfh1ZznQ6zsVaG",
          config: {
            domainName: "test2.eth",
            provider: "http://localhost:8545",
            ensRegistryAddress: "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab"
          }
        },
        result: "wrap://ens/test2.eth"
      },
      {
        id: "from_uri",
        name: "from_uri",
        input: {
          uri: "wrap://ipfs/QmVdDR6QtigTt38Xwpj2Ki73X1AyZn5WRCreBCJq1CEtpF",
          config: {
            domainName: "test3.eth",
            provider: "http://localhost:8545",
            ensRegistryAddress: "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab"
          }
        },
        result: "wrap://ens/test3.eth"
      }
    ])
  });

  it("Should show warning if no manifest ext is found in deploy package", async () => {
    const { exitCode: code, stdout: output } = await runCLI(
      {
        args: ["deploy"],
        cwd: getTestCaseDir(1),
        cli: polywrapCli,
      },
    );

    const sanitizedOutput = clearStyle(output);

    expect(code).toEqual(0);
    expect(sanitizedOutput).toContain(
      "No manifest extension found in"
    );
    expect(sanitizedOutput).toContain(
      "Successfully executed stage 'ipfs_test'"
    );
  });

  it("Should throw if manifest ext exists and config property is invalid", async () => {
    const { exitCode: code, stderr } = await runCLI(
      {
        args: ["deploy"],
        cwd: getTestCaseDir(2),
        cli: polywrapCli,
      },
    );

    const sanitizedErr = clearStyle(stderr);

    expect(code).toEqual(1);
    expect(sanitizedErr).toContain("domainName is not of a type(s) string")
  });

  it("Should throw and stop chain if error is found", async () => {
    const { exitCode: code, stdout: output, stderr } = await runCLI(
      {
        args: ["deploy"],
        cwd: getTestCaseDir(3),
        cli: polywrapCli,
      },
    );

    const sanitizedOutput = clearStyle(output);
    const sanitizedErr = clearStyle(stderr);

    expect(code).toEqual(1);
    expect(sanitizedOutput).toContain(
      "Successfully executed stage 'ipfs_deploy'"
    );
    expect(sanitizedOutput).not.toContain(
      "Successfully executed stage 'from_deploy2'"
    );

    expect(sanitizedErr).toContain(
      "Failed to execute stage 'from_deploy'"
    );
  });

  it("Should throw if environment variable is not loaded but defined in manifest", async () => {
    const { exitCode: code, stderr } = await runCLI(
      {
        args: ["deploy"],
        cwd: getTestCaseDir(4),
        cli: polywrapCli,
      },
    );

    const sanitizedErr = clearStyle(stderr);
    expect(code).toEqual(1);
    expect(sanitizedErr).toContain("Environment variable not found: `NON_LOADED_VAR`");
  });
});
