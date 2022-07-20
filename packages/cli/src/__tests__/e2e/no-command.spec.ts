import { clearStyle, polywrapCli } from "./utils";

import { runCLI } from "@polywrap/test-env-js";


const HELP = `Usage: polywrap [options] [command]

Options:
  -h, --help                  display help for command

Commands:
  app|a                       Build/generate types for your app
  build|b [options]           Builds a wrapper
  codegen|g [options]         Auto-generate Wrapper Types
  create|c                    Create a new project with polywrap CLI
  deploy|d [options]          Deploys/Publishes a Polywrap
  plugin|p                    Build/generate types for the plugin
  infra|i [options] <action>  Manage infrastructure for your wrapper
  run|r [options] <workflow>  Runs workflow script
  docgen|o [options]          Generate wrapper documentation
  help [command]              display help for command
`;

describe("e2e tests for no command", () => {
  
  it("Should throw error for unrecognized command", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["unknown"],
      cli: polywrapCli
    });
    expect(code).toEqual(1);
    expect(error).toBe(`error: unknown command 'unknown'\n`);
    expect(output).toEqual(``);
  });

  it("Should let the user to type polywrap help", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: [],
      cli: polywrapCli,
    });
    expect(code).toEqual(1);
    expect(clearStyle(error)).toBe(clearStyle(HELP));
    expect(output).toEqual(``);
  });
});