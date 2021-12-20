import path from "path";
import { defaultManifest } from "../../commands/dapp";
import { clearStyle } from "./utils";

import { runCLI } from "@web3api/test-env-js";
import { compareSync } from "dir-compare";

const HELP = `
w3 dapp command [options]

Commands:
  codegen   Generate code for the plugin (supported languages: typescript)

Options:
  -h, --help                              Show usage information
  -m, --manifest-path <path>              Path to the Web3API manifest file (default: ${defaultManifest.join(
    " | "
  )})
  -o, --output-dir <path>                 Output directory for the generated types (default: types/)
  -l, --lang <lang>                       Output language for generated types (default: typescript)
  -i, --ipfs [<node>]                     IPFS node to load external schemas (default: ipfs.io & localhost)
  -e, --ens [<address>]                   ENS address to lookup external schemas (default: 0x0000...2e1e)

`;

describe("e2e tests for dapp command", () => {
  const projectRoot = path.resolve(__dirname, "../project/");

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["dapp", "--help"],
        cwd: projectRoot,
      },
      "../../../bin/w3"
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
      },
      "../../../bin/w3"
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
      },
      "../../../bin/w3"
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
      },
      "../../../bin/w3"
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--ens option missing <[address,]domain> argument
${HELP}`);
  });

  test("Should throw error for invalid params - lang", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["dapp", "codegen", "--lang"],
        cwd: projectRoot,
      },
      "../../../bin/w3"
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--lang option must specify a supported language
${HELP}`);
  });

  test("Should successfully generate types", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["dapp", "codegen"],
        cwd: projectRoot,
      },
      "../../../bin/w3"
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`- Generate types
- Manifest loaded from ./web3api.yaml
✔ Manifest loaded from ./web3api.yaml
  Generating types from types-ts.mustache
- Generate types
✔ Generate types
🔥 Types were generated successfully 🔥
`);

    const expectedTypesResult = compareSync(
      `${projectRoot}/types`,
      `${projectRoot}/expected-types`,
      { compareContent: true }
    );

    expect(expectedTypesResult.differences).toBe(0);
  });
});
