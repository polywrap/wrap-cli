import path from "path";
import { clearStyle, w3Cli } from "./utils";

import { runCLI } from "@web3api/test-env-js";

const HELP =  `Usage: w3 [options] [command]

Options:
  -h, --help         display help for command

Commands:
  app|a              Build/generate types for your app
  query|q [options]  Query Web3APIs using recipe scripts
  test-env|t         Manage a test environment for Web3API
  help [command]     display help for command
`


describe("e2e tests for no help", () => {
  const projectRoot = path.resolve(__dirname, "../project/");

  test("Should display the help content", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["help"],
      cwd: projectRoot,
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toContain(HELP);
  });
});
