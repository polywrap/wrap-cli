import { clearStyle, w3Cli } from "./utils";

import { runCLI } from "@web3api/test-env-js";
import { GetPathToCliTestFiles } from "@web3api/test-cases";
import path from "path";
import fs from "fs";

const HELP = `
w3 app command [options]

Commands:
  codegen   Generate code for the app

Options:
  -h, --help                              Show usage information
  -m, --manifest-file <path>              Path to the Web3API App manifest file (default: web3api.app.yaml | web3api.app.yml)
  -c, --codegen-dir <path>                 Output directory for the generated code (default: ./src/w3)
  -i, --ipfs [<node>]                     IPFS node to load external schemas (default: ipfs.io & localhost)
  -e, --ens [<address>]                   ENS address to lookup external schemas (default: 0x0000...2e1e)

`;

const CODEGEN_SUCCESS = `- Manifest loaded from ./web3api.app.yaml
✔ Manifest loaded from ./web3api.app.yaml
- Generate types
✔ Generate types
🔥 Code was generated successfully 🔥
`;

describe("e2e tests for app command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "app/codegen");
  const testCases =
    fs.readdirSync(testCaseRoot, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  const getTestCaseDir = (index: number) =>
    path.join(testCaseRoot, testCases[index]);

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["app", "codegen", "--help"],
        cwd: getTestCaseDir(0),
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
        args: ["app", "--output-dir"],
        cwd: getTestCaseDir(0),
        cli: w3Cli,
      },
    );

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`Please provide a command
${HELP}`);
  });

  test("Should throw error for invalid params - codegen-dir", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["app", "codegen", "--codegen-dir"],
        cwd: getTestCaseDir(0),
        cli: w3Cli,
      },
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
        args: ["app", "codegen", "--ens"],
        cwd: getTestCaseDir(0),
        cli: w3Cli,
      },
    );

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--ens option missing [<address>] argument
${HELP}`);
  });

  describe("test-cases", () => {
    for (let i = 0; i < testCases.length; ++i) {
      const testCaseName = testCases[i];
      const testCaseDir = getTestCaseDir(i);

      test(testCaseName, async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI(
          {
            args: ["app", "codegen"],
            cwd: testCaseDir,
            cli: w3Cli,
          },
        );

        console.log(output, error);

        expect(error).toBe("");
        expect(code).toEqual(0);
        expect(clearStyle(output)).toEqual(CODEGEN_SUCCESS);
      });
    }
  });
});
