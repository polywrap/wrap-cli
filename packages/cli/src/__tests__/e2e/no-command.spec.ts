import { clearStyle, w3Cli } from "./utils";

import { runCLI } from "@web3api/test-env-js";

describe("e2e tests for no command", () => {
  
  test("Should throw error for unrecognized command", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["unknown"],
      cli: w3Cli
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`w3 unknown is not a command\n`);
  });

  test("Should let the user to type w3 help", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: [],
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(
      `Type w3 help to view common commands\n`
    );
  });
});
