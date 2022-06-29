import { clearStyle, polywrapCli } from "./utils";

import { runCLI } from "@polywrap/test-env-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import path from "path";
import fs from "fs";
import rimraf from "rimraf";

const HELP = `Usage: polywrap app|a [options] [command]

Build/generate types for your app

Options:
  -h, --help         display help for command

Commands:
  codegen [options]  Generate code for the app
  help [command]     display help for command
`;

const CODEGEN_SUCCESS = `- Manifest loaded from ./polywrap.app.yaml
✔ Manifest loaded from ./polywrap.app.yaml
- Generate types
✔ Generate types
🔥 Code was generated successfully 🔥
`;

describe("e2e tests for app command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "app/codegen");
  const testCases = fs
    .readdirSync(testCaseRoot, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  const getTestCaseDir = (index: number) =>
    path.join(testCaseRoot, testCases[index]);

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["app", "--help"],
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Should show help for no command", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["app"],
      cli: polywrapCli,
    });

    expect(code).toEqual(1);
    expect(error).toBe(HELP);
    expect(output).toBe("");
  });

  test("Should throw error for invalid command", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["app", "invalid"],
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });

    expect(code).toEqual(1);
    expect(error).toBe("error: unknown command 'invalid'\n");
    expect(output).toEqual(``);
  });

  test("Should throw error for unknown option --output-dir", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["app", "--output-dir"],
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });

    expect(code).toEqual(1);
    expect(error).toBe("error: unknown option '--output-dir'\n");
    expect(output).toEqual(``);
  });

  test("Should throw error if params not specified for --custom-config option", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["app", "--custom-config"],
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });

    expect(code).toEqual(1);
    expect(error).toBe("error: unknown option '--custom-config'\n");
    expect(output).toEqual(``);
  });

  test("Should throw error is params not specified for --codegen-dir option", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["app", "codegen", "--codegen-dir"],
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });

    expect(code).toEqual(1);
    expect(error).toBe(
      `error: option '-g, --codegen-dir <path>' argument missing\n`
    );
    expect(output).toEqual(``);
  });

  test("Should store generated files to specified codegen dir", async () => {
    const codegenDir = path.resolve(
      process.env.TMPDIR || "/tmp",
      `codegen-${Date.now()}`
    );
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["app", "codegen", "--codegen-dir", codegenDir],
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });

    expect(error).toBe("");
    expect(code).toEqual(0);
    expect(clearStyle(output)).toEqual(CODEGEN_SUCCESS);

    expect(fs.existsSync(path.join(codegenDir, "index.ts"))).toBeTruthy();
    expect(fs.existsSync(path.join(codegenDir, "schema.ts"))).toBeTruthy();
    expect(fs.existsSync(path.join(codegenDir, "types.ts"))).toBeTruthy();

    rimraf.sync(codegenDir);
  });

  test("Should generate the files correctly using explicitly specified manifest file", async () => {
    const testCaseDir = getTestCaseDir(0);
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: [
        "app",
        "codegen",
        "--manifest-file",
        path.join(getTestCaseDir(0), "polywrap.custom.app.yaml"),
      ],
      cwd: testCaseDir,
      cli: polywrapCli,
    });

    const codegenDir = path.resolve(testCaseDir, "src", "wrap");

    expect(error).toBe("");
    expect(code).toEqual(0);
    expect(clearStyle(output)).toEqual(CODEGEN_SUCCESS.replace(/.\/polywrap.app.yaml/g, "./polywrap.custom.app.yaml"));

    expect(fs.existsSync(path.join(codegenDir, "index.ts"))).toBeTruthy();
    expect(fs.existsSync(path.join(codegenDir, "schema.ts"))).toBeTruthy();
    expect(fs.existsSync(path.join(codegenDir, "types.ts"))).toBeTruthy();

    rimraf.sync(codegenDir);
  });

  test("Should codegen correctly while custom client config file specified", async () => {
    const testCaseDir = getTestCaseDir(0);
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: [
        "app",
        "codegen",
        "--client-config",
        path.join(getTestCaseDir(3), "config.ts"),
      ],
      cwd: testCaseDir,
      cli: polywrapCli,
    });

    const codegenDir = path.resolve(testCaseDir, "src", "wrap");

    expect(error).toBe("");
    expect(code).toEqual(0);
    expect(clearStyle(output)).toEqual(CODEGEN_SUCCESS);

    expect(fs.existsSync(path.join(codegenDir, "index.ts"))).toBeTruthy();
    expect(fs.existsSync(path.join(codegenDir, "schema.ts"))).toBeTruthy();
    expect(fs.existsSync(path.join(codegenDir, "types.ts"))).toBeTruthy();

    rimraf.sync(codegenDir);
  });

  describe("test-cases", () => {
    for (let i = 0; i < testCases.length - 1; ++i) {
      const testCaseName = testCases[i];
      const testCaseDir = getTestCaseDir(i);

      test(testCaseName, async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["app", "codegen"],
          cwd: testCaseDir,
          cli: polywrapCli,
        });

        const codegenDir = path.resolve(testCaseDir, "src", "wrap");

        expect(error).toBe("");
        expect(code).toEqual(0);
        expect(clearStyle(output)).toEqual(CODEGEN_SUCCESS);

        expect(fs.existsSync(path.join(codegenDir, "index.ts"))).toBeTruthy();
        expect(fs.existsSync(path.join(codegenDir, "schema.ts"))).toBeTruthy();
        expect(fs.existsSync(path.join(codegenDir, "types.ts"))).toBeTruthy();
      });
    }
  });
});
