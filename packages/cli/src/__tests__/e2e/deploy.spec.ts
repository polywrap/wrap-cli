import { clearStyle, w3Cli } from "./utils";
import { loadDeployManifest } from "../../lib";

import { 
  initTestEnvironment,
  runCLI,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { GetPathToCliTestFiles } from "@web3api/test-cases";
import axios from "axios";
import { Web3ApiClient } from "@web3api/client-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { Wallet } from "ethers";
import yaml from "js-yaml";
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
  const projectRoot = getTestCaseDir(0);
  const { ethereum } = await initTestEnvironment();
  const { data } = await axios.get("http://localhost:4040/deploy-ens");

  const ensAddress = data.ensAddress
  const resolverAddress = data.resolverAddress
  const registrarAddress = data.registrarAddress
  const signer = new Wallet("0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d");

  const { __type, ...deployManifest } = await loadDeployManifest(`${projectRoot}/web3api.deploy.yaml`);

  Object.entries(deployManifest.stages).forEach(([key, value]) => {
    if (value.config && value.config.ensRegistryAddress) {
      deployManifest.stages[key].config!.ensRegistryAddress = ensAddress;
    }
  })

  await fs.promises.writeFile(
    `${projectRoot}/web3api.deploy.yaml`,
    yaml.dump(deployManifest)
  )

  const client = new Web3ApiClient({
    plugins: [
      {
        uri: "w3://ens/ethereum.web3api.eth",
        plugin: ethereumPlugin({
          networks: {
            testnet: {
              provider: ethereum,
              signer
            }
          },
          defaultNetwork: "testnet"
        }),
      }
    ],
  });

  for await (const domainName of domainNames) {
    await client.invoke({
      uri: "w3://ens/rinkeby/ens.web3api.eth",
      module: "mutation",
      method: "registerDomain",
      input: {
        domain: domainName,
        owner: signer.address,
        registrarAddress,
        registryAddress: ensAddress,
        connection: {
          networkNameOrChainId: "testnet",
        },
      },
    })

    await client.invoke({
      uri: `w3://ens/rinkeby/ens.web3api.eth`,
      module: "mutation",
      method: "setResolver",
      input: {
        domain: domainName,
        resolverAddress,
        registryAddress: ensAddress,
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
  });

  afterAll(async () => {
    await stopTestEnvironment();
  })

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
    const { exitCode: code, stdout: output } = await runCLI(
      {
        args: ["deploy"],
        cwd: getTestCaseDir(0),
        cli: w3Cli,
      },
    );

    const sanitizedOutput = clearStyle(output);

    expect(code).toEqual(0);
    expect(sanitizedOutput).toContain(
      "Successfully executed stage 'ipfs_deploy'"
    );
    expect(sanitizedOutput).toContain(
      "Successfully executed stage 'from_deploy'"
    );
    expect(sanitizedOutput).toContain(
      "Successfully executed stage 'from_deploy2'"
    );
    expect(sanitizedOutput).toContain(
      "Successfully executed stage 'from_uri'"
    );
  });

  test("Throws and stops chain if error is found", async () => {
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
});
