import path from "path";
import { clearStyle, w3Cli } from "./utils";

import { runCLI } from "@web3api/test-env-js";


describe("e2e tests for test-env command", () => {
  const projectRoot = path.resolve(__dirname, "../project/");

  test("Should successfully start test environment", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["test-env", "up"],
      cwd: projectRoot,
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toContain(`Starting test environment...`);

    await runCLI({
      args: ["test-env", "down"],
      cwd: projectRoot,
      cli: w3Cli,
    });
  }, 60000);

  test("Should successfully shut down test environment", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["test-env", "down"],
      cwd: projectRoot,
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toContain(`Shutting down test environment...`);
  }, 20000);
});
