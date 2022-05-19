import { clearStyle, w3Cli } from "./utils";

import { runCLI } from "@web3api/test-env-js";

const HELP = `
w3 test-env command

Commands:
  up    Startup the test env
  down  Shutdown the test env

Options:
  -h, --help          Show usage information

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

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`No command given
${HELP}`);
  });

  test("Should throw error for unrecognized command", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["test-env", "unknown"],
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`Unrecognized command: unknown
${HELP}`);
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
