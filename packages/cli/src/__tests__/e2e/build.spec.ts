import { PolywrapProject, loadBuildManifest } from "../../lib";
import { clearStyle, polywrapCli } from "./utils";

import { runCLI } from "@polywrap/test-env-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import fs from "fs";
import path from "path";

const HELP = `Usage: polywrap build|b [options]

Builds a wrapper

Options:
  -m, --manifest-file <path>          Path to the Polywrap Build manifest file
                                      (default: polywrap.yaml | polywrap.yml)
  -o, --output-dir <path>             Output directory for build results
                                      (default: build/)
  -c, --client-config <config-path>   Add custom configuration to the
                                      PolywrapClient
  -w, --watch                         Automatically rebuild when changes are
                                      made (default: false)
  -v, --verbose                       Verbose output (default: false)
  -h, --help                          display help for command
`;

jest.setTimeout(500000);

describe("e2e tests for build command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "wasm/build-cmd");
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
        cli: polywrapCli,
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
        cli: polywrapCli,
      },
    );

    expect(code).toEqual(1);
    expect(error).toContain("error: option '-o, --output-dir <path>' argument missing");
    expect(output).toBe("")
  });

  test("Adds uuid-v4 suffix to build image if no build manifest specified", async () => {
    const projectRoot = getTestCaseDir(0);
    const project = new PolywrapProject({
      rootDir: projectRoot,
      polywrapManifestPath: path.join(projectRoot, "polywrap.yaml")
    });

    await project.cacheDefaultBuildImage();

    const cacheBuildEnvPath = path.join(projectRoot, ".polywrap/wasm/build/image")
    const cachedBuildManifest = await loadBuildManifest(
      path.join(cacheBuildEnvPath, "polywrap.build.yaml")
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
           cli: polywrapCli,
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
