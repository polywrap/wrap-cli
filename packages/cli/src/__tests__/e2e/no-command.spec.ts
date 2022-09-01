import { clearStyle, polywrapCli } from "./utils";

import { runCLI } from "@polywrap/test-env-js";


const HELP = `Usage: polywrap [options] [command]

Options:
  -h, --help                   display help for command

Commands:
  build|b [options]            Build Polywrap Projects (type: interface, wasm)
  codegen|g [options]          Generate Code For Polywrap Projects
  create|c                     Create New Projects
  deploy|d [options]           Deploys Polywrap Projects
  infra|i [options] <action>   Modular Infrastructure-As-Code Orchestrator
  run|r [options] <workflow>   Runs Workflows
  docgen|o [options] <action>  Generate wrapper documentation
  help [command]               display help for command
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