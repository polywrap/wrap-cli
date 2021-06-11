import path from "path";
import { clearStyle, w3Cli } from "./utils";

import { runCLI } from "@web3api/test-env-js";

const HELP = `
w3 env <command> [options] [<web3api-manifest>]

Commands:
  config  Validate and display Web3API environment's bundled docker-compose manifest
  down     Stop Web3API environment
  help     Show usage information
  up     Start Web3API environment
  vars  Show Web3API environment's required .env variables

Options:
  -d, --detached                     Run in detached mode
  -m, --modules [<node>]       Use only specified modules
  -v, --verbose                      Verbose output (default: false)

`;

describe("e2e tests for env command", () => {
  const projectRoot = path.resolve(__dirname, "../project/");

  test.skip("Should throw error for no command given", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["env"],
        cwd: projectRoot,
      },
      w3Cli
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`No command given
${HELP}`);
  });

  test.skip("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["env", "help"],
        cwd: projectRoot,
      },
      w3Cli
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Successfully extracts composed docker manifest's environment variable list", async () => {
    const { exitCode: code, stdout: output } = await runCLI(
      {
        args: ["env", "vars", "web3api.docker.yaml"],
        cwd: projectRoot,
      },
      w3Cli
    );

    console.log(output)

    const sanitizedOutput = clearStyle(output);

    expect(code).toEqual(0);
    expect(sanitizedOutput).toContain("IPFS_PORT");
    expect(sanitizedOutput).toContain("DEV_SERVER_PORT");
    expect(sanitizedOutput).toContain("ETHEREUM_PORT");
  });

  test.only("Successfully validates and displays composed docker manifest", async () => {
    const { exitCode: code, stdout: output } = await runCLI(
      {
        args: ["env", "config", "web3api.docker.yaml", "-v"],
        cwd: projectRoot,
      },
      w3Cli
    );

    console.log(output)

    const sanitizedOutput = clearStyle(output);

    // expect(code).toEqual(0);
    // expect(sanitizedOutput).toContain("IPFS_PORT");
    // expect(sanitizedOutput).toContain("DEV_SERVER_PORT");
    // expect(sanitizedOutput).toContain("ETHEREUM_PORT");
  });
  
});
