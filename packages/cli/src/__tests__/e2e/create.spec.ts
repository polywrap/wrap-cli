import { clearStyle, polywrapCli } from "./utils";

import { runCLI } from "@polywrap/test-env-js";
import rimraf from "rimraf";

const HELP = `Usage: polywrap create|c [options] [command]

Create a new project with polywrap CLI

Options:
  -h, --help                          display help for command

Commands:
  wasm [options] <language> <name>    Create a Polywrap wasm wrapper langs:
                                      assemblyscript, interface
  app [options] <language> <name>     Create a Polywrap application langs:
                                      typescript-node, typescript-react
  plugin [options] <language> <name>  Create a Polywrap plugin langs:
                                      typescript
  help [command]                      display help for command
`;

describe("e2e tests for create command", () => {
  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["create", "--help"],
      cli: polywrapCli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Should throw error for missing parameter - type", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["create"],
      cli: polywrapCli,
    });

    expect(code).toEqual(1);
    expect(error).toBe(HELP);
    expect(output).toBe("");
  });

  test("Should throw error for missing parameter - lang", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["create", "type"],
      cli: polywrapCli,
    });

    expect(code).toEqual(1);
    expect(error).toContain("error: unknown command 'type'");
    expect(output).toBe("");
  });

  test("Should throw error for missing parameter - name", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["create", "type", "lang"],
      cli: polywrapCli,
    });

    expect(code).toEqual(1);
    expect(error).toContain("error: unknown command 'type'");
    expect(output).toBe("");
  });

  test("Should throw error for invalid parameter - type", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["create", "unknown", "app", "name"],
      cli: polywrapCli,
    });

    expect(code).toEqual(1);
    expect(error).toContain("error: unknown command 'unknown'");
    expect(output).toBe("");
  });

  test("Should throw error for invalid parameter - lang", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["create", "wasm", "unknown", "name"],
      cli: polywrapCli,
    });

    expect(code).toEqual(1);
    expect(error).toContain("error: command-argument value 'unknown' is invalid for argument 'language'. Allowed choices are assemblyscript, interface.");
    expect(output).toBe("");
  });

  test("Should throw error for invalid parameter - output-dir", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["create", "wasm", "assemblyscript", "name", "-o"],
      cli: polywrapCli,
    });

    expect(code).toEqual(1);
    expect(error).toContain("error: option '-o, --output-dir <path>' argument missing");
    expect(output).toBe("");
  });

  test("Should successfully generate project", async () => {
    rimraf.sync(`${__dirname}/test`);

    const { exitCode: code, stdout: output } = await runCLI({
      args: [
        "create",
        "wasm",
        "assemblyscript",
        "test",
        "-o",
        `${__dirname}/test`,
      ],
      cwd: __dirname,
      cli: polywrapCli,
    });

    expect(code).toEqual(0);
    expect(clearStyle(output)).toContain(
      `🔥 You are ready to turn your protocol into a Polywrap 🔥`
    );

    rimraf.sync(`${__dirname}/test`);
  }, 60000);
});
