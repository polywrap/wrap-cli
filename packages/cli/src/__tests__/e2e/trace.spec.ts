import path from "path";
import { clearStyle } from "./utils";

import { runCLI } from "@web3api/test-env-js";
import { Tracer } from "@web3api/tracing";

const HELP = `
w3 trace [command] [options]

Commands:
  up       Start logging server
  down     Stop logging server

Options:
  -l, --level               Set log level (default: debug)
  -h, --help                Show usage information

`;

describe("e2e tests for trace command", () => {
  const projectRoot = path.resolve(__dirname, "../project/");

  beforeAll(() => {
    process.env.TRACE_SERVER_PORT = "4040";
    process.env.TRACE_SERVER = "true";
  });

  test("Should throw error for unrecognized command", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["trace", "unknown"],
        cwd: projectRoot,
      },
      "../../../bin/w3"
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`Unrecognized command: unknown
${HELP}`);
  });

  test("Should throw error for unrecognized level", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["trace", "-l", "unknown"],
        cwd: projectRoot,
      },
      "../../../bin/w3"
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`Unrecognized level: unknown
${HELP}`);
  });

  test("Should successfully start the logging-server", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["trace", "up"],
        cwd: projectRoot,
      },
      "../../../bin/w3"
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`Log level was set to debug
`);
    expect(await Tracer.getLogLevel()).toEqual("debug");
  });

  test("Should successfully set log level", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["trace", "-l", "debug"],
        cwd: projectRoot,
      },
      "../../../bin/w3"
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`Log level was set to debug
`);
    expect(await Tracer.getLogLevel()).toEqual("debug");
  });
});
