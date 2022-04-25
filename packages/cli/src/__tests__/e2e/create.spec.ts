import { supportedLangs } from "../../commands/create";
import { clearStyle, w3Cli } from "./utils";

import { runCLI } from "@web3api/test-env-js";
import rimraf from "rimraf";

const HELP = `
w3 create command <project-name> [options]

Commands:
  api <lang>     Create a Web3API project
    langs: ${supportedLangs.api.join(", ")}
  app <lang>     Create a Web3API application
    langs: ${supportedLangs.app.join(", ")}
  plugin <lang>  Create a Web3API plugin
    langs: ${supportedLangs.plugin.join(", ")}

Options:
  -h, --help               Show usage information
  -o, --output-dir <path>  Output directory for the new project

`;

describe("e2e tests for create command", () => {

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["create", "--help"],
      cli: w3Cli,
    });

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual("Please provide a command\n" + HELP);
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
      args: ["create", "api", "assemblyscript", "test", "-o", `${__dirname}/test`],
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
