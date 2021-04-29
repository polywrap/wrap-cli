import path from "path";
import { clearStyle } from "./utils";

import { runCLI } from "@web3api/test-env-js";
import { Tracer } from "@web3api/tracing";

const HELP = `
w3 trace level

Levels:
  debug    Log both events & exceptions
  info     Log only events
  error    Log only errors
  off      Turn off logging

`;

describe("e2e tests for trace command", () => {
  const projectRoot = path.resolve(__dirname, "../project/");

  test("Should throw error for no level given", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["trace"],
        cwd: projectRoot,
      },
      "../../../bin/w3"
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`No level given
${HELP}`);
  });

  test("Should throw error for unrecognized level", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["trace", "unknown"],
        cwd: projectRoot,
      },
      "../../../bin/w3"
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`Unrecognized level: unknown
${HELP}`);
  });

  test("Should successfully set log level", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["trace", "debug"],
        cwd: projectRoot,
      },
      "../../../bin/w3"
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`Log level was set to debug
`);
    expect(Tracer.logLevel).toEqual("debug");
  });
});
