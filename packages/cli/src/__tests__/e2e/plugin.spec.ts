import { defaultPluginManifest } from "../../lib";
import { clearStyle } from "./utils";

import { runCLI } from "@web3api/test-env-js";
import { GetPathToCliTestFiles } from "@web3api/test-cases";
import { compareSync } from "dir-compare";
import path from "path";
import fs from "fs";

const HELP = `
w3 plugin command [options]

Commands:
  codegen   Generate code for the plugin

Options:
  -h, --help                       Show usage information
  -m, --manifest-file <path>       Path to the Web3API Plugin manifest file (default: ${defaultPluginManifest.join(
    " | "
  )})
  -p, --publish-dir <path>  Output path for the built schema and manifest (default: ./build)
  -c, --codegen-dir <path>    Output directory for the generated types (default: ./src/w3)
  -i, --ipfs [<node>]              IPFS node to load external schemas (default: dev-server's node)
  -e, --ens [<address>]            ENS address to lookup external schemas (default: 0x0000...2e1e)

`;

const CODEGEN_SUCCESS = `- Manifest loaded from ./web3api.plugin.yaml
✔ Manifest loaded from ./web3api.plugin.yaml
- Generate types
✔ Generate types
- Manifest written to ./build/web3api.plugin.json
✔ Manifest written to ./build/web3api.plugin.json
`;

describe("e2e tests for plugin command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "plugin/codegen");
  const testCases =
    fs.readdirSync(testCaseRoot, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  const getTestCaseDir = (index: number) =>
    path.join(testCaseRoot, testCases[index]);

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["plugin", "--help"],
        cwd: getTestCaseDir(0),
      }
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Should throw error for invalid params - no command", async () => {
    const { exitCode: code, stdout: output } = await runCLI(
      {
        args: ["plugin", "--codegen-dir"],
        cwd: getTestCaseDir(0),
      }
    );

    expect(code).toEqual(1);
    expect(clearStyle(output)).toEqual("Please provide a command\n" + HELP);
  });

  test("Should throw error for invalid params - publish-dir", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["plugin", "codegen", "--publish-dir"],
        cwd: getTestCaseDir(0),
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
        cwd: getTestCaseDir(0),
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
        cwd: getTestCaseDir(0),
      }
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
            args: ["plugin", "codegen"],
            cwd: testCaseDir,
          }
        );

        expect(error).toBe("");
        expect(code).toEqual(0);
        expect(clearStyle(output)).toEqual(CODEGEN_SUCCESS);

        const expectedTypesResult = compareSync(
          `${testCaseDir}/src`,
          `${testCaseDir}/expected/src`,
          { compareContent: true }
        );

        expect(expectedTypesResult.differences).toBe(0);

        const expectedBuildResult = compareSync(
          `${testCaseDir}/build`,
          `${testCaseDir}/expected/build-artifacts`,
          { compareContent: true }
        );

        expect(expectedBuildResult.differences).toBe(0);
      });
    }
  });
});
