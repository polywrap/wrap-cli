import { Web3ApiProject, loadBuildManifest } from "../../lib";
import { clearStyle, w3Cli } from "./utils";

import { runCLI } from "@web3api/test-env-js";
import { GetPathToCliTestFiles } from "@web3api/test-cases";
import fs from "fs";
import path from "path";

const HELP = `
w3 build [options]

Options:
  -h, --help                         Show usage information
  -m, --manifest-file <path>         Path to the Web3API Build manifest file (default: web3api.yaml | web3api.yml)
  -o, --output-dir <path>            Output directory for build results (default: build/)
  -w, --watch                        Automatically rebuild when changes are made (default: false)
  -v, --verbose                      Verbose output (default: false)

`;

jest.setTimeout(500000);

describe("e2e tests for build command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "api/build-cmd");
  const testCases =
    fs.readdirSync(testCaseRoot, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  const getTestCaseDir = (index: number) =>
    path.join(testCaseRoot, testCases[index]);

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["build", "--help"],
        cwd: getTestCaseDir(0),
        cli: w3Cli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Should throw error for invalid params - outputDir", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["build", "--output-dir"],
        cwd: getTestCaseDir(0),
        cli: w3Cli,
      },
    );

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--output-dir option missing <path> argument
${HELP}`);
  });

  test("Adds uuid-v4 suffix to build-env image if no build manifest specified", async () => {
    const projectRoot = getTestCaseDir(0);
    const project = new Web3ApiProject({
      rootCacheDir: projectRoot,
      web3apiManifestPath: path.join(projectRoot, "web3api.yaml")
    });

    await project.cacheDefaultBuildManifestFiles();

    const cacheBuildEnvPath = path.join(projectRoot, ".w3/web3api/build/env")
    const cachedBuildManifest = await loadBuildManifest(
      path.join(cacheBuildEnvPath, "web3api.build.yaml")
    );

    const buildImageName = cachedBuildManifest.docker?.name

    expect(buildImageName?.length).toBeGreaterThan(36)
    expect((buildImageName?.match(/-/g) || []).length).toBeGreaterThanOrEqual(4);
  });

  describe("test-cases", () => {
    for (let i = 0; i < testCases.length; ++i) {
      const testCaseName = testCases[i];
      const testCaseDir = getTestCaseDir(i);

      test(testCaseName, async () => {
        let { exitCode, stdout, stderr } = await runCLI(
          {
            args: ["build", "-v"],
            cwd: testCaseDir,
           cli: w3Cli,
          },
        );

        stdout = clearStyle(stdout);
        stderr = clearStyle(stderr);

        const expected = JSON.parse(
          fs.readFileSync(
            path.join(testCaseDir, "expected/output.json"), "utf-8"
          )
        );

        if (expected.stdout) {
          if (Array.isArray(expected.stdout)) {
            for (const line of expected.stdout) {
              expect(stdout).toContain(line);
            }
          } else {
            expect(stdout).toContain(expected.stdout);
          }
        }

        if (expected.stderr) {
          if (Array.isArray(expected.stderr)) {
            for (const line of expected.stderr) {
              expect(stderr).toContain(line);
            }
          } else {
            expect(stderr).toContain(expected.stderr);
          }
        }

        if (expected.exitCode) {
          expect(exitCode).toEqual(expected.exitCode);
        }

        if (expected.files) {
          for (const file of expected.files) {
            expect(fs.existsSync(path.join(testCaseDir, file))).toBeTruthy();
          }
        }
      });
    }
  });
});
