import { PolywrapProject, loadBuildManifest } from "../../lib";
import { clearStyle, polywrapCli } from "./utils";

import { runCLI } from "@polywrap/test-env-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import fs from "fs";
import path from "path";

const HELP = `Usage: polywrap build|b [options]

Builds a wrapper

Options:
  -m, --manifest-file <path>         Path to the Polywrap Build manifest file
                                     (default: polywrap.yaml | polywrap.yml)
  -o, --output-dir <path>            Output directory for build results
                                     (default: build/)
  -c, --client-config <config-path>  Add custom configuration to the
                                     PolywrapClient
  -w, --watch                        Automatically rebuild when changes are
                                     made (default: false)
  -v, --verbose                      Verbose output (default: false)
  -h, --help                         display help for command
`;

jest.setTimeout(500000);

describe("e2e tests for build command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "wasm/build-cmd");
  const testCases = fs
    .readdirSync(testCaseRoot, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  const getTestCaseDir = (index: number) =>
    path.join(testCaseRoot, testCases[index]);

  const testCliOutput = (
    testCaseDir: string,
    exitCode: number,
    stdout: string,
    stder: string
  ) => {
    const output = clearStyle(stdout);
    const error = clearStyle(stder);

    const expected = JSON.parse(
      fs.readFileSync(
        path.join(testCaseDir, "expected", "stdout.json"),
        "utf-8"
      )
    );

    if (expected.stdout) {
      if (Array.isArray(expected.stdout)) {
        for (const line of expected.stdout) {
          expect(output).toContain(line);
        }
      } else {
        expect(output).toContain(expected.stdout);
      }
    }

    if (expected.stderr) {
      if (Array.isArray(expected.stderr)) {
        for (const line of expected.stderr) {
          expect(error).toContain(line);
        }
      } else {
        expect(error).toContain(expected.stderr);
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
  };

  const testBuildOutput = (testCaseDir: string) => {
    const expectedOutputFile = path.join(
      testCaseDir,
      "expected",
      "output.json"
    );
    if (fs.existsSync(expectedOutputFile)) {
      const buildDir = path.join(testCaseDir, "build");
      const expectedFiles = JSON.parse(
        fs.readFileSync(expectedOutputFile, { encoding: "utf8" })
      );

      for (const file of expectedFiles) {
        if (!fs.existsSync(path.join(buildDir, file))) {
          expect(path.join(buildDir, file)).toBe("debug")
        }
        expect(fs.existsSync(path.join(buildDir, file))).toBeTruthy();
      }
    }
  };

  it("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["build", "--help"],
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  it("Should throw error for unknown option --invalid", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["build", "--invalid"],
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });

    expect(code).toEqual(1);
    expect(error).toBe("error: unknown option '--invalid'\n");
    expect(output).toEqual(``);
  });

  describe("missing option arguments", () => {
    const missingOptionArgs = {
      "--manifest-file": "-m, --manifest-file <path>",
      "--output-dir": "-o, --output-dir <path>",
      "--client-config": "-c, --client-config <config-path>"
    }

    for (const [option, errorMessage] of Object.entries(missingOptionArgs)) {
      it(`Should throw error if params not specified for ${option} option`, async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["build", option],
          cwd: getTestCaseDir(0),
          cli: polywrapCli,
        });

        expect(code).toEqual(1);
        expect(error).toBe(
          `error: option '${errorMessage}' argument missing\n`
        );
        expect(output).toEqual(``);
      });
    }
  });

  it("Should throw error if params not specified for --client-config option", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["build", "--client-config"],
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });

    expect(code).toEqual(1);
    expect(error).toContain(
      "error: option '-c, --client-config <config-path>' argument missing"
    );
    expect(output).toBe("");
  });

  it("Should store build files in specified output dir", async () => {
    const outputDir = path.resolve(
      process.env.TMPDIR || "/tmp",
      `codegen-${Date.now()}`
    );
    const testCaseDir = getTestCaseDir(0);
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["build", "-v", "--output-dir", outputDir],
      cwd: testCaseDir,
      cli: polywrapCli,
    });
    const buildDir = `./${path.relative(testCaseDir, outputDir)}`;

    expect(error).toBe("");
    expect(code).toEqual(0);
    expect(output).toContain(`Artifacts written to ${buildDir}`);
    expect(output).toContain(`Manifest written to ${buildDir}/polywrap.json`);

    testBuildOutput(testCaseDir);
  });

  it("Should add uuid-v4 suffix to build image if no build manifest specified", async () => {
    const projectRoot = getTestCaseDir(0);
    const project = new PolywrapProject({
      rootDir: projectRoot,
      polywrapManifestPath: path.join(projectRoot, "polywrap.yaml"),
    });

    await project.cacheDefaultBuildImage();

    const cacheBuildEnvPath = path.join(
      projectRoot,
      ".polywrap/wasm/build/image"
    );
    const cachedBuildManifest = await loadBuildManifest(
      path.join(cacheBuildEnvPath, "polywrap.build.yaml")
    );

    const buildImageName = cachedBuildManifest.docker?.name;

    expect(buildImageName?.length).toBeGreaterThan(36);
    expect((buildImageName?.match(/-/g) || []).length).toBeGreaterThanOrEqual(
      4
    );
  });

  describe("test-cases", () => {
    for (let i = 0; i < testCases.length; ++i) {
      const testCaseName = testCases[i];
      const testCaseDir = getTestCaseDir(i);

      let cmdArgs: string[] = [];
      let cmdFile = path.join(testCaseDir, "cmd.json");
      if (fs.existsSync(cmdFile)) {
        const cmdConfig = JSON.parse(fs.readFileSync(cmdFile, "utf-8"));
        if (cmdConfig.args) {
          cmdArgs.push(...cmdConfig.args);
        }
      }

      test(testCaseName, async () => {
        let { exitCode, stdout, stderr } = await runCLI({
          args: ["build", "-v", ...cmdArgs],
          cwd: testCaseDir,
          cli: polywrapCli,
        });

        testCliOutput(testCaseDir, exitCode, stdout, stderr);
        testBuildOutput(testCaseDir);
      });
    }
  });
});
