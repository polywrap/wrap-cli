import { clearStyle, w3Cli } from "./utils";

import { 
  initTestEnvironment,
  runCLI, stopTestEnvironment,
} from "@web3api/test-env-js";
import path from "path";
import axios from "axios";
import { DeployManifest, Web3ApiClient } from "@web3api/client-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { keccak256 } from "js-sha3";
import { Wallet } from "ethers";
import { namehash } from "ethers/lib/utils";
import yaml from "js-yaml";
import fs from "fs";

const projectRoot = path.resolve(__dirname, "../project/");

const HELP = `
w3 deploy [options]

Options:
  -h, --help                         Show usage information
  -m, --manifest-file <path>         Path to the Web3API Deploy manifest file (default: web3api.yaml | web3api.yml)
  -v, --verbose                      Verbose output (default: false)
  -p, --path <path>                  Path to the build directory
`;

const setup = async (domainNames: string[]) => {
  const { ethereum } = await initTestEnvironment();
  const { data } = await axios.get("http://localhost:4040/deploy-ens");

  const ensAddress = data.ensAddress
  const resolverAddress = data.resolverAddress
  const registrarAddress = data.registrarAddress
  const signer = new Wallet("0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d");

  const deployManifest = yaml.load(
    await fs.promises.readFile(
      `${projectRoot}/web3api.deploy.yaml`,
      "utf8"
    )
  ) as DeployManifest;

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

  test.only("Successfully deploys the project", async () => {
    const { stdout: output, stderr: error } = await runCLI(
      {
        args: ["deploy"],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    console.log(output)
    console.log(error)
  });
});
