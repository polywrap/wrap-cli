import { clearStyle, w3Cli } from "./utils";

import { runCLI } from "@web3api/test-env-js";


const HELP = `Usage: w3 [options] [command]

Options:
  -h, --help                  display help for command

Commands:
  app|a                       Build/generate types for your app
  build|b [options]           Builds a Web3API
  codegen|g [options]         Auto-generate API Types
  create|c                    Create a new project with w3 CLI
  deploy|d [options]          Deploys/Publishes a Web3API
  plugin|p                    Build/generate types for the plugin
  query|q [options] <recipe>  Query Web3APIs using recipe scripts
  infra|i [options] <action>  Manage infrastructure for your Web3API
  help [command]              display help for command
`;

describe("e2e tests for no command", () => {
  
  test("Should throw error for unrecognized command", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["unknown"],
      cli: w3Cli
    });
    expect(code).toEqual(1);
    expect(error).toBe(`error: unknown command 'unknown'\n`);
    expect(output).toEqual(``);
  });

  test("Should let the user to type w3 help", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: [],
      cli: w3Cli,
    });
    expect(code).toEqual(1);
    expect(clearStyle(error)).toBe(clearStyle(HELP));
    expect(output).toEqual(``);
  });
});