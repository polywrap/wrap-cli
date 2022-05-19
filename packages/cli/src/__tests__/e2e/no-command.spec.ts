import path from "path";
import { clearStyle, w3Cli } from "./utils";

import { runCLI } from "@web3api/test-env-js";


const HELP = `Usage: w3 [options] [command]

Options:
  -h, --help           display help for command

Commands:
  app|a                Build/generate types for your app
  build|b [options]    Builds a Web3API and (optionally) uploads it to IPFS
  codegen|g [options]  Auto-generate API Types
  query|q [options]    Query Web3APIs using recipe scripts
  test-env|t           Manage a test environment for Web3API
  help [command]       display help for command
`

describe("e2e tests for no command", () => {
  const projectRoot = path.resolve(__dirname, "../project/");
  
  test("Should throw error for unrecognized command", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["unknown"],
      cwd: projectRoot,
      cli: w3Cli
    });
    expect(code).toEqual(1);
    expect(error).toBe(`error: unknown command 'unknown'\n`);
    expect(output).toEqual(``);
  });

  test("Should let the user to type w3 help", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: [],
      cwd: projectRoot,
      cli: w3Cli,
    });
    expect(code).toEqual(1);
    expect(clearStyle(error)).toBe(clearStyle(HELP));
    expect(output).toEqual(``);
  });
});