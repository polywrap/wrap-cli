import path from "path";
import { clearStyle, w3Cli } from "./utils";
import { runCLI } from "@web3api/test-env-js";
import { compareSync } from "dir-compare";
import * as fs from "fs";
import axios from "axios";
import {
  InvokeApiOptions,
  Web3ApiClient,
} from "@web3api/client-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";

const HELP = `
w3 dapp command [options]

Commands:
  codegen   Generate code for the dApp

Options:
  -h, --help                              Show usage information
  -m, --manifest-path <path>              Path to the Web3API manifest file (default: web3api.dapp.yaml | web3api.dapp.yml)
  -o, --output-dir <path>                 Output directory for the generated code (default: polywrap/)
  -i, --ipfs [<node>]                     IPFS node to load external schemas (default: ipfs.io & localhost)
  -e, --ens [<address>]                   ENS address to lookup external schemas (default: 0x0000...2e1e)

`;

describe("e2e tests for dapp command", () => {
  const projectRoot = path.resolve(__dirname, "../dapp/");
  const simpleStorageProject = path.resolve(__dirname, "../project/");

  beforeAll(async () => {
    await testEnvUp(simpleStorageProject);
    await buildAndDeployApi(simpleStorageProject, "simplestorage.eth");
  });

  afterAll(async () => {
    await testEnvDown(simpleStorageProject);
  });

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["dapp", "--help"],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Should throw error for invalid params - no command", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["dapp", "--output-dir"],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`Please provide a command
${HELP}`);
  });

  test("Should throw error for invalid params - output-dir", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["dapp", "codegen", "--output-dir"],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--output-dir option missing <path> argument
${HELP}`);
  });

  test("Should throw error for invalid params - ens", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["dapp", "codegen", "--ens"],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--ens option missing <[address,]domain> argument
${HELP}`);
  });

  test("Should throw error for duplicate namespace", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["dapp", "codegen", `-m ${projectRoot}/web3api.dapp.duplicateNamespace.yaml`],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual("Duplicate namespace in dapp manifest\n");
  });

  test("Should successfully generate types for wrappers", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["dapp", "codegen", `-m ${projectRoot}/web3api.dapp.typesOnly.yaml`],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`- Generate types
  Generating types from packageTypes-ts.mustache
- Generate types
✔ Generate types
🔥 Generated types for namespace project 🔥
- Generate types
  Generating types from baseTypes-ts.mustache
- Generate types
  Generating types from dappIndex-ts.mustache
- Generate types
✔ Generate types
🔥 Generated top-level code for dApp 🔥
🔥 Code was generated successfully 🔥
`);

    const expectedTypesResult = compareSync(
      `${projectRoot}/polywrap/project/types.ts`,
      `${projectRoot}/expected-types/project/types.ts`,
      { compareContent: true }
    );

    expect(expectedTypesResult.differences).toBe(0);
  });

  test("Should successfully generate types for plugins", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["dapp", "codegen", `-m ${projectRoot}/web3api.dapp.withPlugin.yaml`],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`- Generate types
- Manifest loaded from ./.w3/ExternalProjects/http/web3api.plugin.yaml
✔ Manifest loaded from ./.w3/ExternalProjects/http/web3api.plugin.yaml
  Generating types from packageTypes-ts.mustache
- Generate types
✔ Generate types
🔥 Generated types for namespace http 🔥
- Generate types
  Generating types from baseTypes-ts.mustache
- Generate types
  Generating types from dappIndex-ts.mustache
- Generate types
✔ Generate types
🔥 Generated top-level code for dApp 🔥
🔥 Code was generated successfully 🔥
`);

    const expectedTypesResult = compareSync(
      `${projectRoot}/polywrap/http`,
      `${projectRoot}/expected-types/http`,
      { compareContent: true }
    );

    expect(expectedTypesResult.differences).toBe(0);
  });

  test("Should successfully generate types for multiple packages", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["dapp", "codegen", `-m ${projectRoot}/web3api.dapp.multiPackage.yaml`],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`- Generate types
  Generating types from packageTypes-ts.mustache
- Generate types
✔ Generate types
🔥 Generated types for namespace erc20 🔥
- Generate types
  Generating types from packageTypes-ts.mustache
- Generate types
✔ Generate types
🔥 Generated types for namespace console 🔥
- Generate types
- Manifest loaded from ./.w3/ExternalProjects/ethereum/web3api.plugin.yaml
✔ Manifest loaded from ./.w3/ExternalProjects/ethereum/web3api.plugin.yaml
  Generating types from packageTypes-ts.mustache
- Generate types
✔ Generate types
🔥 Generated types for namespace ethereum 🔥
- Generate types
  Generating types from baseTypes-ts.mustache
- Generate types
  Generating types from dappIndex-ts.mustache
- Generate types
✔ Generate types
🔥 Generated top-level code for dApp 🔥
🔥 Code was generated successfully 🔥
`);

    expect(fs.existsSync(`${projectRoot}/polywrap/erc20/types.ts`)).toBeTruthy();
    expect(fs.existsSync(`${projectRoot}/polywrap/console/types.ts`)).toBeTruthy();
    expect(fs.existsSync(`${projectRoot}/polywrap/ethereum/types.ts`)).toBeTruthy();
  });

  test("Should clear file cache before completion", async () => {
    const { exitCode: code, stderr: error } = await runCLI(
      {
        args: ["dapp", "codegen", `-m ${projectRoot}/web3api.dapp.multiPackage.yaml`],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(fs.existsSync(`${projectRoot}/.w3/ExternalProjects/erc20/`)).toBeFalsy();
    expect(fs.existsSync(`${projectRoot}/.w3/ExternalProjects/console/`)).toBeFalsy();
    expect(fs.existsSync(`${projectRoot}/.w3/ExternalProjects/ethereum/`)).toBeFalsy();
    expect(fs.existsSync(`${projectRoot}/.w3/ExternalProjects`)).toBeFalsy();
    expect(fs.existsSync(`${projectRoot}/.w3`)).toBeFalsy();
  });

  test("Should be able to read/call extension props from client", async () => {
    const { exitCode: code, stderr: error } = await runCLI(
      {
        args: ["dapp", "codegen", `-m ${projectRoot}/web3api.dapp.yaml`],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );
    expect(code).toEqual(0);
    expect(error).toBe("");

    // instantiate Client and PolywrapDapp
    const { ipfs, ethereum, ensAddress } = await getProviders();
    const client: Web3ApiClient = await createClient(
      ipfs,
      ethereum,
      ensAddress
    );

    // import newly generated project extension code
    // @ts-ignore
    const pw = await import ("../dapp/polywrap");
    // @ts-ignore
    const dapp: pw.PolywrapDapp = new pw.PolywrapDapp(client);

    // expect to access uri property
    const expectedUriPath: string = path.resolve(path.join(__dirname, "../project/build"));
    // @ts-ignore
    expect(dapp.project.config?.uri.path).toEqual(expectedUriPath);

    // test ExtensionInvocation
    // @ts-ignore
    const result: string = await dapp.project.mutation.deployContract({
      connection: {
        networkNameOrChainId: "testnet",
      },
    });
    expect(result).toBeTruthy()

    // @ts-ignore
    const config: InvokeApiOptions = dapp.project.mutation.config.deployContract({
      connection: {
        networkNameOrChainId: "testnet",
      },
    });
    expect(config).toStrictEqual({
      uri: `w3://fs/${expectedUriPath}`,
      module: "mutation",
      method: "deployContract",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
      },
    });
  });
});

async function testEnvUp(cwd: string): Promise<void> {
  const { exitCode: testenvCode, stderr: testEnvUpErr } = await runCLI({
    args: ["test-env", "up"],
    cwd: cwd,
    cli: w3Cli,
  });
  expect(testEnvUpErr).toBe("");
  expect(testenvCode).toEqual(0);
}

async function testEnvDown(cwd: string): Promise<void> {
  await runCLI({
    args: ["test-env", "down"],
    cwd: cwd,
    cli: w3Cli,
  });
}

// @ts-ignore
async function buildAndDeployApi(cwd: string, ensUri: string): Promise<void> {
  const { exitCode: buildCode, stderr: buildErr } = await runCLI({
    args: [
      "build",
      "--ipfs",
      "http://localhost:5001",
      "--test-ens",
      ensUri,
    ],
    cwd: cwd,
    cli: w3Cli,
  });
  expect(buildErr).toBe("");
  expect(buildCode).toEqual(0);
}

async function getProviders(): Promise<{
  ipfs: string;
  ethereum: string;
  ensAddress: string;
}> {
  const { data: { ipfs, ethereum }, } = await axios.get("http://localhost:4040/providers");
  const { data } = await axios.get("http://localhost:4040/deploy-ens");
  return { ipfs, ethereum, ensAddress: data.ensAddress };
}

async function createClient(ipfs: string, ethereum: string, ensAddress: string): Promise<Web3ApiClient> {
  return new Web3ApiClient({
    plugins: [
      {
        uri: "w3://ens/ipfs.web3api.eth",
        plugin: ipfsPlugin({ provider: ipfs }),
      },
      {
        uri: "w3://ens/ens.web3api.eth",
        plugin: ensPlugin({ addresses: { testnet: ensAddress } }),
      },
      {
        uri: "w3://ens/ethereum.web3api.eth",
        plugin: ethereumPlugin({
          networks: {
            testnet: {
              provider: ethereum
            },
          },
          defaultNetwork: "testnet"
        }),
      },
    ],
  });
}