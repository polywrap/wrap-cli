import path from "path";
import { defaultWeb3ApiManifest } from "../../lib";
import { clearStyle, w3Cli } from "./utils";

import { runCLI } from "@web3api/test-env-js";
import rimraf from "rimraf";

const HELP = `
w3 codegen [options]

Options:
  -h, --help                              Show usage information
  -m, --manifest-file <path>              Path to the Web3API manifest file (default: ${defaultWeb3ApiManifest.join(
    " | "
  )})
  -c, --custom <path>                     Path to a custom generation script (JavaScript | TypeScript)
  -o, --custom-output-dir <path>          Output directory for custom generated types (default: 'types/')
  -i, --ipfs [<node>]                     IPFS node to load external schemas (default: ipfs.io & localhost)
  -e, --ens [<address>]                   ENS address to lookup external schemas (default: 0x0000...2e1e)

`;

describe("e2e tests for codegen command", () => {
  const projectRoot = path.resolve(__dirname, "../project/");

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["codegen", "--help"],
      cwd: projectRoot,
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Should throw error for invalid params - customOutputDir", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["codegen", "--custom-output-dir"],
      cwd: projectRoot,
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--custom-output-dir option missing <path> argument
${HELP}`);
  });

  test("Should throw error for invalid params - ens", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["codegen", "--ens"],
      cwd: projectRoot,
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--ens option missing <[address,]domain> argument
${HELP}`);
  });

  test("Should throw error for invalid generation file - wrong file", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["codegen", "--custom", `web3api-invalid.gen.js`],
      cwd: projectRoot,
      cli: w3Cli,
    });

    const genFile = path.normalize(`${projectRoot}/web3api-invalid.gen.js`);

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output)).toContain(`Failed to generate types: Cannot find module '${genFile}'`);
  });

  test("Should throw error for invalid generation file - no run() method", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["codegen", "--custom", `web3api-norun.gen.js`],
      cwd: projectRoot,
      cli: w3Cli,
    });

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output)).toContain(`Failed to generate types: The generation file provided doesn't have the 'run' method.`);
  });

  test("Should successfully generate types", async () => {
    rimraf.sync(`${projectRoot}/types`);

    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["codegen"],
      cwd: projectRoot,
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toContain(`🔥 Types were generated successfully 🔥`);

    rimraf.sync(`${projectRoot}/types`);
  });
});
