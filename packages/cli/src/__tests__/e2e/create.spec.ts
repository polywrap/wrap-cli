import path from "path";
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
    const projectRoot = path.resolve(__dirname, "../project");

    test("Should show help text", async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
            args: ["create", "--help"],
            cwd: projectRoot,
            cli: w3Cli,
        });

        expect(code).toEqual(0);
        expect(error).toBe("");
        expect(clearStyle(output)).toEqual(HELP);
    });

    test("Should throw error for missing parameter - type", async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
            args: ["create"],
            cwd: projectRoot,
            cli: w3Cli,
        });

        expect(code).toEqual(1);
        expect(error).toBe(HELP);
        expect(output).toEqual("");
    });

    test("Should throw error for missing parameter - lang", async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
            args: ["create", "type"],
            cwd: projectRoot,
            cli: w3Cli,
        });

        expect(code).toEqual(1);
        expect(error).toBe(`error: unknown command 'type'\n`);
        expect(output).toEqual("");
    });

      test("Should throw error for missing parameter - name", async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["create", "type", "lang"],
          cwd: projectRoot,
          cli: w3Cli,
        });

        expect(code).toEqual(1);
        expect(error).toBe("error: unknown command 'type'\n");
        expect(output).toEqual("");
      });

      test("Should throw error for invalid parameter - output-dir", async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["create", "api", "assemblyscript", "name", "-o"],
          cwd: projectRoot,
          cli: w3Cli,
        });

        expect(code).toEqual(1);
        expect(error).toBe("error: option '-o, --output-dir <path>' argument missing\n");
        expect(output)
          .toEqual(``);
      });

      test("Should successfully generate project", async () => {
        rimraf.sync(`${projectRoot}/test`);

        const { exitCode: code, stdout: output } = await runCLI({
          args: ["create", "api", "assemblyscript", "test", "-o", `${projectRoot}/test`],
          cwd: projectRoot,
          cli: w3Cli,
        });

        expect(code).toEqual(0);
        expect(clearStyle(output)).toContain(
          `🔥 You are ready to turn your protocol into a Web3API 🔥`
        );

        rimraf.sync(`${projectRoot}/test`);
      }, 60000);
});
