import path from "path";
import { defaultPluginManifest } from "../../lib";
import { clearStyle } from "./utils";

import { runCLI } from "@web3api/test-env-js";
import { compareSync } from "dir-compare";

const HELP = `
w3 plugin command [options]

Commands:
  codegen   Generate code for the plugin

Options:
  -h, --help                       Show usage information
  -m, --manifest-file <path>       Path to the Web3API manifest file (default: ${defaultPluginManifest.join(
    " | "
  )})
  -p, --publish-dir <path>  Output path for the built schema and manifest (default: ./build)
  -c, --codegen-dir <path>    Output directory for the generated types (default: ./src/w3)
  -i, --ipfs [<node>]              IPFS node to load external schemas (default: dev-server's node)
  -e, --ens [<address>]            ENS address to lookup external schemas (default: 0x0000...2e1e)

`;

describe("e2e tests for plugin command", () => {
  const projectRoot = path.resolve(__dirname, "../plugin/");

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output } = await runCLI(
      {
        args: ["plugin", "codegen", "--help"],
        cwd: projectRoot,
      }
    );

    expect(code).toEqual(0);
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Should throw error for invalid params - no command", async () => {
    const { exitCode: code, stdout: output } = await runCLI(
      {
        args: ["plugin", "--codegen-dir"],
        cwd: projectRoot,
      }
    );

    expect(code).toEqual(1);
    expect(clearStyle(output)).toEqual("Please provide a command\n" + HELP);
  });

  test("Should throw error for invalid params - publish-dir", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["plugin", "codegen", "--publish-dir"],
        cwd: projectRoot,
      }
    );

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual("--publish-dir option missing <path> argument\n" + HELP);
  });

  test("Should throw error for invalid params - codegen-dir", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["plugin", "codegen", "--codegen-dir"],
        cwd: projectRoot,
      }
    );

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--codegen-dir option missing <path> argument
${HELP}`);
  });

  test("Should throw error for invalid params - ens", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["plugin", "codegen", "--ens"],
        cwd: projectRoot,
      }
    );

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--ens option missing <[address,]domain> argument
${HELP}`);
  });

  test("Should successfully generate types", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["plugin", "codegen"],
        cwd: projectRoot,
      }
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`- Manifest loaded from ./web3api.plugin.yaml
✔ Manifest loaded from ./web3api.plugin.yaml
- Generate types
✔ Generate types
- Manifest written to ./build/web3api.plugin.json
✔ Manifest written to ./build/web3api.plugin.json
`);

    const expectedTypesResult = compareSync(
      `${projectRoot}/src/w3`,
      `${projectRoot}/expected-types`,
      { compareContent: true }
    );

    expect(expectedTypesResult.differences).toBe(0);

    const expectedSchemaResult = compareSync(
      `${projectRoot}/build`,
      `${projectRoot}/expected-schema`,
      { compareContent: true }
    );

    expect(expectedSchemaResult.differences).toBe(0);
  });
});
