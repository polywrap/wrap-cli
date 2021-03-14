import path from "path";
import { clearStyle } from "./utils";

import { runCLI } from "@web3api/test-env-js";

const HELP = `
w3 test-env command

Commands:
  up    Startup the test env
  down  Shutdown the test env

`;

describe("e2e tests for test-env command", () => {
  const projectRoot = path.resolve(__dirname, "../project/");

  test("Should throw error for no command given", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["test-env"],
      cwd: projectRoot
    }, "../../../bin/w3");

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`No command given
${HELP}`);
  });

  test("Should throw error for unrecognized command", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["test-env", "unknown"],
      cwd: projectRoot
    }, "../../../bin/w3");

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`Unrecognized command: unknown
${HELP}`);
  });

  test("Should successfully start test environment", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["test-env", "up"],
      cwd: projectRoot
    }, "../../../bin/w3");

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`- Starting test environment...
✔ Starting test environment...
`);

    await runCLI({
      args: ["test-env", "down"],
      cwd: projectRoot
    }, "../../../bin/w3");
  }, 30000);

  test("Should successfully shut down test environment", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["test-env", "down"],
      cwd: projectRoot
    }, "../../../bin/w3");

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`- Shutting down test environment...
✔ Shutting down test environment...
`);
  }, 20000);
});
