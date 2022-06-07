import { clearStyle, w3Cli } from "./utils";

import { 
  initTestEnvironment,
  runCLI,
  stopTestEnvironment,
  ensAddresses,
  providers
} from "@web3api/test-env-js";
import { GetPathToCliTestFiles } from "@web3api/test-cases";
import { Web3ApiClient } from "@web3api/client-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { Wallet } from "@ethersproject/wallet";
import path from "path";
import fs from "fs";

const HELP = `Usage: w3 deploy|d [options]

Deploys/Publishes a Web3API

Options:
  -m, --manifest-file <path>  Path to the Web3API Deploy manifest file
                              (default: web3api.yaml | web3api.yml)
  -v, --verbose               Verbose output (default: false)
  -h, --help                  display help for command
`;

const testCaseRoot = path.join(GetPathToCliTestFiles(), "api/deploy");
  const testCases =
    fs.readdirSync(testCaseRoot, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  const getTestCaseDir = (index: number) =>
    path.join(testCaseRoot, testCases[index]);

const setup = async (domainNames: string[]) => {
  await initTestEnvironment();

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

  const ethereumPluginUri = "w3://ens/ethereum.web3api.eth"
  const client = new Web3ApiClient({
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
    path.dirname(require.resolve("@web3api/test-env-js")),
    "wrappers", "ens"
  )}`;

  for await (const domainName of domainNames) {
    await client.invoke<{ hash: string }>({
      uri: ensWrapperUri,
      module: "mutation",
      method: "registerDomainAndSubdomainsRecursively",
      input: {
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
          cli: w3Cli,
        },
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["deploy", "--help"],
        cwd: getTestCaseDir(0),
        cli: w3Cli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Successfully deploys the project", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["deploy"],
        cwd: getTestCaseDir(0),
        cli: w3Cli,
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

  test("Should show warning if no manifest ext is found in deploy package", async () => {
    const { exitCode: code, stdout: output } = await runCLI(
      {
        args: ["deploy"],
        cwd: getTestCaseDir(1),
        cli: w3Cli,
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

  test("Throws if manifest ext exists and config property is invalid", async () => {
    const { exitCode: code, stderr } = await runCLI(
      {
        args: ["deploy"],
        cwd: getTestCaseDir(2),
        cli: w3Cli,
      },
    );

    const sanitizedErr = clearStyle(stderr);

    expect(code).toEqual(1);
    expect(sanitizedErr).toContain("domainName is not of a type(s) string")
  });

  test("Throws and stops chain if error is found", async () => {
    const { exitCode: code, stdout: output, stderr } = await runCLI(
      {
        args: ["deploy"],
        cwd: getTestCaseDir(3),
        cli: w3Cli,
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

  test("Throws if environment variable is not loaded but defined in manifest", async () => {
    const { exitCode: code, stderr } = await runCLI(
      {
        args: ["deploy"],
        cwd: getTestCaseDir(4),
        cli: w3Cli,
      },
    );

    const sanitizedErr = clearStyle(stderr);
    expect(code).toEqual(1);
    expect(sanitizedErr).toContain("Environment variable not found: `NON_LOADED_VAR`");
  });
});
