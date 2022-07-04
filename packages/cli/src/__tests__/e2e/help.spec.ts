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
  help [command]              display help for command
`;

describe("e2e tests for no help", () => {

  it("Should display the help content", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["help"],
      cli: polywrapCli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toContain(HELP);
  });
});
