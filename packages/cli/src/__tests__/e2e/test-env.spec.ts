import { clearStyle, w3Cli } from "./utils";

import { runCLI } from "@web3api/test-env-js";

const HELP = `Usage: w3 test-env|t [options] [command]

Manage a test environment for Web3API

Options:
  -h, --help      display help for command

Commands:
  up              Startup the test env
  down            Shutdown the test env
  help [command]  display help for command
`;

describe("e2e tests for test-env command", () => {
  test("Should print help message", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["test-env", "--help"],
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Should throw error for no command given", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["test-env"],
      cli: w3Cli,
    });

    expect(code).toEqual(1);
    expect(error).toBe(HELP);
    expect(output).toBe("");
  });

  test("Should throw error for unrecognized command", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["test-env", "unknown"],
      cli: w3Cli,
    });

    expect(code).toEqual(1);
    expect(error).toContain("error: unknown command 'unknown'");
    expect(output).toBe("");
  });

  test("Should successfully start test environment", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["test-env", "up"],
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toContain(`Starting test environment...`);

    await runCLI({
      args: ["test-env", "down"],
      cli: w3Cli,
    });
  }, 60000);

  test("Should successfully shut down test environment", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["test-env", "down"],
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toContain(`Shutting down test environment...`);
  }, 20000);
});
