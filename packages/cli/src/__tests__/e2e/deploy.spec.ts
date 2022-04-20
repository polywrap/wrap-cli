import { clearStyle, w3Cli } from "./utils";

import { 
  initTestEnvironment,
  runCLI, stopTestEnvironment,
} from "@web3api/test-env-js";
import path from "path";
import axios from "axios";
import { Web3ApiClient } from "@web3api/client-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { keccak256 } from "js-sha3";
import { Wallet } from "ethers";
import { namehash } from "ethers/lib/utils";
import yaml from "js-yaml";
import fs from "fs";
import { loadDeployManifest } from "../../lib";

const projectRoot = path.resolve(__dirname, "../project/");

const HELP = `
w3 deploy [options]

Options:
  -h, --help                         Show usage information
  -m, --manifest-file <path>         Path to the Web3API Deploy manifest file (default: web3api.yaml | web3api.yml)
  -v, --verbose                      Verbose output (default: false)
`;

const setup = async (domainNames: string[]) => {
  const { ethereum } = await initTestEnvironment();
  const { data } = await axios.get("http://localhost:4040/deploy-ens");

  const ensAddress = data.ensAddress
  const resolverAddress = data.resolverAddress
  const registrarAddress = data.registrarAddress
  const signer = new Wallet("0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d");

  // TODO: use the "loadDeployManifest" function
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

  // TODO: why not use the ENS wrapper here?
  for await (const domainName of domainNames) {
    const label = "0x" + keccak256(domainName)
    await client.query({
      uri: "w3://ens/ethereum.web3api.eth",
      query: `
        mutation {
          callContractMethodAndWait(
            address: "${registrarAddress}", 
            method: "function register(bytes32 label, address owner)", 
            args: ["${label}", "${signer.address}"],
            txOverrides: {
              value: null,
              nonce: null,
              gasPrice: "50",
              gasLimit: "200000"
            }
          )
        }
      `,
    });

    await client.query({
      uri: "w3://ens/ethereum.web3api.eth",
      query: `
        mutation {
          callContractMethod(
            address: "${ensAddress}",
            method: "function setResolver(bytes32 node, address owner)",
            args: ["${namehash(`${domainName}.eth`)}", "${resolverAddress}"]
          )
        }
      `
    });
  }
}

describe("e2e tests for deploy command", () => {
  beforeAll(async () => {
    await setup(["test1", "test2", "test3"])
    await runCLI(
      {
        args: ["build", "-v"],
        cwd: projectRoot,
       cli: w3Cli,
      },
    );
  })

  afterAll(async () => {
    await stopTestEnvironment();
  })

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["deploy", "--help"],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Successfully deploys the project", async () => {
    const { exitCode: code, stdout: output, stderr } = await runCLI(
      {
        args: ["deploy"],
        cwd: projectRoot,
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
    const { exitCode: code, stdout: output, stderr } = await runCLI(
      {
        args: ["deploy", "--manifest-file", "web3api-deploy-fail-between.yaml"],
        cwd: projectRoot,
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

  test("Throws if manifest ext exists and config property is invalid", async () => {
    const { exitCode: code, stderr } = await runCLI(
      {
        args: ["deploy", "--manifest-file", "web3api-deploy-invalid-config.yaml"],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    const sanitizedErr = clearStyle(stderr);

    expect(code).toEqual(1);
    expect(sanitizedErr).toContain("domainName is not of a type(s) string")
  });

  test("Throws and stops chain if error is found", async () => {
    const { exitCode: code, stdout: output } = await runCLI(
      {
        args: ["deploy", "--manifest-file", "web3api-deploy-no-ext.yaml"],
        cwd: projectRoot,
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
});
