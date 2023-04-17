import { clearStyle, polywrapCli } from "../utils";

import { runCli } from "@polywrap/cli-js";


const HELP = `Usage: polywrap [options] [command]

Options:
  -h, --help                   display help for command

Commands:
  build|b [options]            Build Polywrap Projects (type: interface, wasm)
  codegen|g [options]          Generate Code For Polywrap Projects
  create|c                     Create New Projects
  deploy|d [options]           Deploys Polywrap Projects
  docgen|o [options] <action>  Generate wrapper documentation
  infra|i [options] <action>   Modular Infrastructure-As-Code Orchestrator
  manifest|m                   Inspect & Migrade Polywrap Manifests
  test|t [options]             Execute Tests
  help [command]               display help for command
`;

describe("e2e tests for no command", () => {
  
  it("Should throw error for unrecognized command", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCli({
      args: ["unknown"],
      config: {
        cli: polywrapCli
      }
    });
    expect(code).toEqual(1);
    expect(error).toBe(`error: unknown command 'unknown'\n`);
    expect(output).toEqual(``);
  });

  it("Should let the user to type polywrap help", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCli({
      args: [],
      config: {
        cli: polywrapCli
      }
    });
    expect(code).toEqual(1);
    expect(clearStyle(error)).toBe(clearStyle(HELP));
    expect(output).toEqual(``);
  });
});
