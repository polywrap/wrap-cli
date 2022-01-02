import path from "path";
import { clearStyle, w3Cli } from "./utils";
import { runCLI } from "@web3api/test-env-js";
import { compareSync } from "dir-compare";
import * as fs from "fs";
import { Web3ApiClient } from "@web3api/client-js";

const HELP = `
w3 dapp command [options]

Commands:
  types       Generate type code for wrappers
  extension   Generate client extension code for wrappers

Options:
  -h, --help                              Show usage information
  -m, --manifest-path <path>              Path to the Web3API manifest file (default: web3api.dapp.yaml | web3api.dapp.yml)
  -o, --output-dir <path>                 Output directory for the generated code (default: polywrap/)
  -i, --ipfs [<node>]                     IPFS node to load external schemas (default: ipfs.io & localhost)
  -e, --ens [<address>]                   ENS address to lookup external schemas (default: 0x0000...2e1e)

`;

describe("e2e tests for dapp command", () => {
  const projectRoot = path.resolve(__dirname, "../dappProject/");

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
        args: ["dapp", "types", "--output-dir"],
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
        args: ["dapp", "types", "--ens"],
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
        args: ["dapp", "types", `-m ${projectRoot}/web3api.dapp.duplicateNamespace.yaml`],
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
        args: ["dapp", "types"],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`- Generate types
  Generating types from baseTypes-ts.mustache
- Generate types
  Generating types from packageTypes-ts.mustache
- Generate types
  Generating types from dappIndex-ts.mustache
- Generate types
✔ Generate types
🔥 Generated types for namespace project 🔥
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
        args: ["dapp", "types", `-m ${projectRoot}/web3api.dapp.withPlugin.yaml`],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`- Generate types
- Manifest loaded from ./.w3/ExternalProjects/http/web3api.plugin.yaml
✔ Manifest loaded from ./.w3/ExternalProjects/http/web3api.plugin.yaml
  Generating types from baseTypes-ts.mustache
- Generate types
  Generating types from packageTypes-ts.mustache
- Generate types
  Generating types from dappIndex-ts.mustache
- Generate types
✔ Generate types
🔥 Generated types for namespace http 🔥
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
        args: ["dapp", "types", `-m ${projectRoot}/web3api.dapp.multiPackage.yaml`],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`- Generate types
  Generating types from baseTypes-ts.mustache
- Generate types
  Generating types from packageTypes-ts.mustache
- Generate types
  Generating types from dappIndex-ts.mustache
- Generate types
✔ Generate types
🔥 Generated types for namespace erc20 🔥
- Generate types
  Generating types from baseTypes-ts.mustache
- Generate types
  Generating types from packageTypes-ts.mustache
- Generate types
  Generating types from dappIndex-ts.mustache
- Generate types
✔ Generate types
🔥 Generated types for namespace console 🔥
- Generate types
- Manifest loaded from ./.w3/ExternalProjects/ethereum/web3api.plugin.yaml
✔ Manifest loaded from ./.w3/ExternalProjects/ethereum/web3api.plugin.yaml
  Generating types from baseTypes-ts.mustache
- Generate types
  Generating types from packageTypes-ts.mustache
- Generate types
  Generating types from dappIndex-ts.mustache
- Generate types
✔ Generate types
🔥 Generated types for namespace ethereum 🔥
🔥 Code was generated successfully 🔥
`);

    expect(fs.existsSync(`${projectRoot}/polywrap/erc20/types.ts`)).toBeTruthy();
    expect(fs.existsSync(`${projectRoot}/polywrap/console/types.ts`)).toBeTruthy();
    expect(fs.existsSync(`${projectRoot}/polywrap/ethereum/types.ts`)).toBeTruthy();
  });

  test("Should clear file cache before completion", async () => {
    const { exitCode: code, stderr: error } = await runCLI(
      {
        args: ["dapp", "types", `-m ${projectRoot}/web3api.dapp.multiPackage.yaml`],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(fs.existsSync(`${projectRoot}/.w3/ExternalProjects/erc20/`)).toBeFalsy();
    expect(fs.existsSync(`${projectRoot}/.w3/ExternalProjects/console/`)).toBeFalsy();
    expect(fs.existsSync(`${projectRoot}/.w3/ExternalProjects/ethereum/`)).toBeFalsy();
  });

  test("Should be able to read extension properties from client", async () => {
    const { exitCode: code, stderr: error } = await runCLI(
      {
        args: ["dapp", "extension", `-m ${projectRoot}/web3api.dapp.yaml`],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );
    expect(code).toEqual(0);
    expect(error).toBe("");

    const proj = await import ("../dappProject/polywrap");
    // @ts-ignore
    const client: Web3ApiClient = new Web3ApiClient({ extensions: [proj.projectExtension({})] });
    const expectedUri: string = path.resolve(path.join(__dirname, "../project/build"));
    // @ts-ignore
    expect(client.project.uri.path).toEqual(expectedUri);
  });
});
