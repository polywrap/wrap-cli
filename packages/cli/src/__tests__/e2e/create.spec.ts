import { clearStyle, w3Cli } from "./utils";

import { runCLI } from "@web3api/test-env-js";
import rimraf from "rimraf";

const HELP = `Usage: w3 create|c [options] [command]

Create a new project with w3 CLI

Options:
  -h, --help                           display help for command

Commands:
  api [options] <lang> <project-name>  Create a Web3API project langs:
                                       assemblyscript, interface
  app [options] <lang>                 Create a Web3API application langs:
                                       typescript-node, typescript-react
  plugin [options] <lang>              Create a Web3API plugin langs:
                                       typescript
  help [command]                       display help for command
`;

describe("e2e tests for create command", () => {
  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["create", "--help"],
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Should throw error for missing parameter - type", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["create"],
      cli: w3Cli,
    });

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`Please provide a command
${HELP}`);
  });

  test("Should throw error for missing parameter - lang", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["create", "type"],
      cli: w3Cli,
    });

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`Please provide a language
${HELP}`);
  });

  test("Should throw error for missing parameter - name", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["create", "type", "lang"],
      cli: w3Cli,
    });

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`Please provide a project name
${HELP}`);
  });

  test("Should throw error for invalid parameter - type", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["create", "unknown", "app", "name"],
      cli: w3Cli,
    });

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`Unrecognized command "unknown"
${HELP}`);
  });

  test("Should throw error for invalid parameter - lang", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["create", "api", "unknown", "name"],
      cli: w3Cli,
    });

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`Unrecognized language "unknown"
${HELP}`);
  });

  test("Should throw error for invalid parameter - output-dir", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["create", "api", "assemblyscript", "name", "-o"],
      cli: w3Cli,
    });

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--output-dir option missing <path> argument
${HELP}`);
  });

  test("Should successfully generate project", async () => {
    rimraf.sync(`${__dirname}/test`);

    const { exitCode: code, stdout: output } = await runCLI({
      args: [
        "create",
        "api",
        "assemblyscript",
        "test",
        "-o",
        `${__dirname}/test`,
      ],
      cwd: __dirname,
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(clearStyle(output)).toContain(
      `🔥 You are ready to turn your protocol into a Web3API 🔥`
    );

    rimraf.sync(`${__dirname}/test`);
  }, 60000);
});
